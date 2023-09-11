import { StripeCustomer } from "@/definitions/StripeCustomer";
import { mustBeLoggedIn } from "@/lib/auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stripeCustomer = new StripeCustomer();
  const session = await getServerSession(authOptions);
  await mustBeLoggedIn(session);
  await stripeCustomer.createCustomerIfNull(session);
  return (
    <div className="">
      {/* <Header /> */}
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
}
