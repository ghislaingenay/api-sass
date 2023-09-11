import Stripe from "stripe";

export class StripeInitializer {
  private stripeApiKey: string = String(process.env.STRIPE_SECRET_KEY);
  protected stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(this.stripeApiKey, {
      apiVersion: "2023-08-16",
    });
  }
}
