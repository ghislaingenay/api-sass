import { StripeCustomer } from "@/definitions/StripeCustomer";
import { StripeInitializer } from "@/definitions/StripeInitializer";
import { getAuthSession, mustBeLoggedIn } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  await mustBeLoggedIn(session);
  const stripeCustomer = new StripeCustomer(session);
  const customer = await stripeCustomer.createCustomerIfNull();

  return (
    <div className="">
      {/* <Header /> */}
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
}
