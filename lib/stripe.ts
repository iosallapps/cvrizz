import Stripe from "stripe";

// Lazy initialization to prevent build errors when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Export as a getter to avoid initialization at module load
export const stripe = {
  get instance(): Stripe {
    return getStripe();
  },
};

// Helper to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Pricing configuration - adjusted for Romanian market
export const PRICES = {
  // Subscription plans
  monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY || "",
    amount: 1999, // 19.99 RON (~$4.50)
    currency: "ron",
    interval: "month" as const,
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_YEARLY || "",
    amount: 14999, // 149.99 RON (~$34) - save 37%
    currency: "ron",
    interval: "year" as const,
  },
  // One-time payment per CV
  perCv: {
    priceId: process.env.STRIPE_PRICE_PER_CV || "",
    amount: 999, // 9.99 RON (~$2.25) per CV export
    currency: "ron",
  },
};

// Helper to get or create Stripe customer
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  existingCustomerId?: string | null
): Promise<string> {
  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await getStripe().customers.create({
    email,
    metadata: {
      userId,
    },
  });

  return customer.id;
}

// Create checkout session for subscription
export async function createSubscriptionCheckout(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });
}

// Create checkout session for one-time CV purchase
export async function createCvPurchaseCheckout(
  customerId: string,
  resumeId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: PRICES.perCv.currency,
          product_data: {
            name: "CV Export",
            description: "One-time CV export to PDF and Word",
          },
          unit_amount: PRICES.perCv.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      resumeId,
      type: "cv_purchase",
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

// Create customer portal session for managing subscription
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Verify webhook signature
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}
