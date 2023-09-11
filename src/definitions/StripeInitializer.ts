import Stripe from "stripe";

export class StripeInitializer {
  private stripeApiKey: string = String(process.env.STRIPE_SECRET_KEY);
  protected stripe: Stripe;
  protected priceId = "price_1Np4euBjGPaNjawoslVUWdYI"; // priceId related to our own product

  constructor() {
    this.stripe = new Stripe(this.stripeApiKey, {
      apiVersion: "2023-08-16",
    });
  }
}
