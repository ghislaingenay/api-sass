import { Session } from "next-auth";
import { StripeInitializer } from "./StripeInitializer";
import { prismaPool } from "./PrismaPool";
import { randomUUID } from "crypto";

type NextAuthSession = Session | null;

export class StripeCustomer extends StripeInitializer {
  session: NextAuthSession = null;
  constructor(session: NextAuthSession = null) {
    super();
    this.session = session;
  }

  async findUserByEmail() {
    const emailFromSession = this.session?.user?.email;
    return await prismaPool.user.findFirst({
      where: {
        email: emailFromSession,
      },
    });
  }

  async createCustomerIfNull() {
    if (this.session) {
      const emailSession = this.session.user?.email;
      const user = await this.findUserByEmail();
      const userHaveStripeUserId = user?.stripe_customer_id;
      if (userHaveStripeUserId) return user;

      const userHaveApiKey = user?.api_key && user?.api_key !== "";
      const apiKey = userHaveApiKey
        ? {}
        : { api_key: "secret_" + randomUUID() };

      const customer = await this.stripe.customers.create({
        email: emailSession!,
      });
      return await prismaPool.user.update({
        where: {
          id: user?.id,
        },
        data: {
          stripe_customer_id: customer.id,
          ...apiKey,
        },
      });
    }
  }

  async getSubscriptionsByCustomerId(stripeCustomerId: string) {
    return await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
    });
  }

  async hasSubscription() {
    if (!this.session) return false;
    const user = await this.findUserByEmail();
    const subscriptions = await this.getSubscriptionsByCustomerId(
      user?.stripe_customer_id!
    );
    const haveSubscriptions = subscriptions.data.length > 0;
    return haveSubscriptions;
  }

  async getUpcomingInvoiceByCustomerId(stripeCustomerId: string) {
    const subscriptions = await this.getSubscriptionsByCustomerId(
      stripeCustomerId
    );
    return await this.stripe.invoices.retrieveUpcoming({
      subscription: subscriptions.data[0].id,
    });
  }

  async retrieveCustomer(stripeCustomerId: string) {
    return await this.stripe.customers.retrieve(stripeCustomerId);
  }

  async addAPICallToRecordByItemId(itemId: string) {
    await this.stripe.subscriptionItems.createUsageRecord(String(itemId), {
      quantity: 1,
    });
  }
}
