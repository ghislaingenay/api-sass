import { Session } from "next-auth";
import { StripeInitializer } from "./StripeInitializer";
import { prismaPool } from "./PrismaPool";

export class StripeCustomer extends StripeInitializer {
  constructor() {
    super();
  }

  async createCustomerIfNull(session: Session | null) {
    if (session) {
      const emailSession = session.user?.email;
      const user = await prismaPool.user.findFirst({
        where: {
          email: emailSession,
        },
      });
      const userHaveStripeUserId = user?.stripe_customer_id;
      if (!userHaveStripeUserId) {
        const customer = await this.stripe.customers.create({
          email: emailSession!,
        });
        await prismaPool.user.update({
          where: {
            id: user?.id,
          },
          data: {
            stripe_customer_id: customer.id,
          },
        });
      }
    }
  }
}
