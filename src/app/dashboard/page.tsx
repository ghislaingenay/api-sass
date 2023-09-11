import { StripeInitializer } from "@/definitions/StripeInitializer";
import { StripeCustomer } from "@definitions/StripeCustomer";
import { getAuthSession } from "@lib/auth";
import React from "react";
import Link from "next/link";

type Props = {};

async function Dashboard({}: Props) {
  const session = await getAuthSession();

  const stripeCustomer = new StripeCustomer(session);
  const customer = await stripeCustomer.createCustomerIfNull();
  const hasSub = await stripeCustomer.hasSubscription();

  const checkoutLink = await new StripeInitializer().createCheckoutLink(
    String(customer?.stripe_customer_id)
  );

  return (
    <>
      {hasSub ? (
        <div>
          <div className="rounded-md px-4 py-2 bg-emerald-400 font-medium text-sm text-white">
            You have a subscription!
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-[60vh] grid place-items-center rounded-lg px-6 py-10 bg-slate-100">
            <Link
              href={String(checkoutLink)}
              className="font-medium text-base hover:underline"
            >
              You have no subscription, checkout now!
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
