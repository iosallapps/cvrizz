import { NextRequest, NextResponse } from "next/server";
import { stripe, constructWebhookEvent } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Handle checkout session completed
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    // THROW to trigger Stripe retry (up to 3 days)
    console.error(`WEBHOOK_RETRY: User not found for customer ${customerId}`);
    throw new Error(`User not found for customer ${customerId}`);
  }

  // Check if this is a one-time CV purchase
  if (session.metadata?.type === "cv_purchase" && session.metadata?.resumeId) {
    try {
      // Use transaction for atomic updates
      await prisma.$transaction([
        prisma.resume.update({
          where: { id: session.metadata.resumeId },
          data: {
            isPurchased: true,
            purchasedAt: new Date(),
          },
        }),
        // Record the purchase if we have a payment intent
        ...(session.payment_intent
          ? [
              prisma.cvPurchase.create({
                data: {
                  resumeId: session.metadata.resumeId,
                  userId: user.id,
                  stripePaymentIntentId: session.payment_intent as string,
                  amount: session.amount_total || 0,
                  currency: session.currency || "ron",
                  status: "completed",
                },
              }),
            ]
          : []),
      ]);
    } catch (dbError) {
      // DB error - throw to retry
      console.error(`WEBHOOK_RETRY: Database error - ${dbError}`);
      throw new Error(`Database error processing checkout: ${dbError}`);
    }
  }
}

// Handle subscription updates
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    // THROW to trigger Stripe retry
    console.error(`WEBHOOK_RETRY: User not found for subscription update: ${customerId}`);
    throw new Error(`User not found for customer ${customerId}`);
  }

  let status: "ACTIVE" | "PAST_DUE" | "CANCELLED" = "ACTIVE";

  if (subscription.status === "past_due") {
    status = "PAST_DUE";
  } else if (
    subscription.status === "canceled" ||
    subscription.status === "unpaid"
  ) {
    status = "CANCELLED";
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: status,
        stripeSubscriptionId: subscription.id,
        currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
      },
    });
  } catch (dbError) {
    console.error(`WEBHOOK_RETRY: Database error updating subscription - ${dbError}`);
    throw new Error(`Database error updating subscription: ${dbError}`);
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    // Subscription deleted for unknown customer - log but don't retry
    console.warn(`Subscription deleted for unknown customer: ${customerId}`);
    return;
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "CANCELLED",
        // Keep access until the end of the current period
        currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
      },
    });
  } catch (dbError) {
    console.error(`WEBHOOK_RETRY: Database error deleting subscription - ${dbError}`);
    throw new Error(`Database error deleting subscription: ${dbError}`);
  }
}

// Handle successful invoice payment
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Check if this invoice is for a subscription
  const invoiceData = invoice as unknown as { subscription?: string; customer: string };
  if (!invoiceData.subscription) return;

  const customerId = invoiceData.customer;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    // THROW to trigger Stripe retry - this is critical
    console.error(`WEBHOOK_RETRY: User not found for invoice paid: ${customerId}`);
    throw new Error(`User not found for customer ${customerId}`);
  }

  try {
    // Reset AI credits on successful payment
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "ACTIVE",
        aiCreditsUsed: 0,
        aiCreditsResetAt: new Date(),
      },
    });
  } catch (dbError) {
    console.error(`WEBHOOK_RETRY: Database error on invoice paid - ${dbError}`);
    throw new Error(`Database error processing invoice: ${dbError}`);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Check if this invoice is for a subscription
  const invoiceData = invoice as unknown as { subscription?: string; customer: string };
  if (!invoiceData.subscription) return;

  const customerId = invoiceData.customer;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    // Payment failed for unknown customer - log but don't retry
    console.warn(`Payment failed for unknown customer: ${customerId}`);
    return;
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "PAST_DUE",
      },
    });
  } catch (dbError) {
    console.error(`WEBHOOK_RETRY: Database error on payment failed - ${dbError}`);
    throw new Error(`Database error processing payment failure: ${dbError}`);
  }
}

// Handle successful one-time payment
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Check if this is a CV purchase
  const purchase = await prisma.cvPurchase.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (purchase) {
    await prisma.cvPurchase.update({
      where: { id: purchase.id },
      data: { status: "completed" },
    });

    await prisma.resume.update({
      where: { id: purchase.resumeId },
      data: {
        isPurchased: true,
        purchasedAt: new Date(),
      },
    });
  }
}
