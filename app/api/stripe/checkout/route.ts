import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  stripe,
  PRICES,
  getOrCreateStripeCustomer,
  createSubscriptionCheckout,
  createCvPurchaseCheckout,
} from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { priceType: string; resumeId?: string };
    const { priceType, resumeId } = body;

    // Get or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || null,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        },
      });
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email!,
      dbUser.stripeCustomerId
    );

    // Update user with Stripe customer ID if new
    if (!dbUser.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    let session;

    if (priceType === "per_cv") {
      // Validate resumeId format (UUID)
      if (!resumeId || !/^[0-9a-f-]{36}$/i.test(resumeId)) {
        return NextResponse.json(
          { error: "Invalid resume ID" },
          { status: 400 }
        );
      }

      // SECURITY: Verify ownership before ANY Stripe operation
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        select: { userId: true, title: true },
      });

      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }

      if (resume.userId !== user.id) {
        // Log potential attack attempt
        console.warn(
          `SECURITY: Ownership violation - User ${user.id} tried to access resume ${resumeId}`
        );
        return NextResponse.json(
          { error: "Access denied" },
          { status: 403 }
        );
      }

      // One-time payment for CV export
      session = await createCvPurchaseCheckout(
        customerId,
        resumeId,
        `${baseUrl}/editor/${resumeId}?payment=success`,
        `${baseUrl}/editor/${resumeId}?payment=cancelled`
      );
    } else if (priceType === "monthly" || priceType === "yearly") {
      // Subscription checkout
      const priceConfig = priceType === "monthly" ? PRICES.monthly : PRICES.yearly;
      const priceId = priceConfig.priceId;

      if (!priceId) {
        return NextResponse.json(
          { error: "Price not configured. Please contact support." },
          { status: 400 }
        );
      }

      session = await createSubscriptionCheckout(
        customerId,
        priceId,
        `${baseUrl}/dashboard?checkout=success`,
        `${baseUrl}/billing?checkout=cancelled`
      );
    } else {
      return NextResponse.json(
        { error: "Invalid price type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
