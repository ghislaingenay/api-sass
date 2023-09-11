import { StripeCustomer } from "@/definitions/StripeCustomer";
import { mustBeLoggedIn } from "@/lib/auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const stripeCustomer = new StripeCustomer(session);
  await mustBeLoggedIn(session);
  await stripeCustomer.createCustomerIfNull();

  const hasSub = await stripeCustomer.hasSubscription();
  console.log("hasSub", hasSub);
  return (
    <div className="">
      {/* <Header /> */}
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
}
