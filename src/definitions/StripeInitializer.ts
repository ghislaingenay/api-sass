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

  async createCheckoutLink(customerId: string) {
    const checkout = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      // payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price: this.priceId,
        },
      ],
      success_url: `${process.env.WEBSITE_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.WEBSITE_URL}/dashboard/billing?canceled=true`,
    });
    return checkout.url;
  }
}
