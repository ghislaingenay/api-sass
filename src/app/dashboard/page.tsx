import { StripeInitializer } from "@/definitions/StripeInitializer";
import { StripeCustomer } from "@definitions/StripeCustomer";
import { getAuthSession } from "@lib/auth";
import React from "react";
import Link from "next/link";
import { prismaPool } from "@/definitions/PrismaPool";

type Props = {};

async function Dashboard({}: Props) {
  const session = await getAuthSession();

  const stripeCustomer = new StripeCustomer(session);
  const customer = await stripeCustomer.createCustomerIfNull();
  const hasSub = await stripeCustomer.hasSubscription();

  const checkoutLink = await new StripeInitializer().createCheckoutLink(
    String(customer?.stripe_customer_id)
  );

  const invoiceData = await stripeCustomer.getUpcomingInvoiceByCustomerId(
    customer?.stripe_customer_id!
  );
  const currentUsage = invoiceData?.amount_due;

  const top10Recentlogs = await prismaPool.log.findMany({
    where: {
      userId: customer?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <>
      {hasSub ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-md px-4 py-2 bg-emerald-400 font-medium text-sm text-white">
            You have a subscription!
          </div>
          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
            <p className="text-sm text-black px-6 py-4 font-medium">
              Current Usage
            </p>
            <p className="text-sm font-mono text-zinc-800 px-6 py-4">
              {currentUsage / 100}
            </p>
          </div>

          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
            <p className="text-sm text-black px-6 py-4 font-medium">API Key</p>
            <p className="text-sm font-mono text-zinc-800 px-6 py-4">
              {customer?.api_key}
            </p>
          </div>
          <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
            <p className="text-sm text-black px-6 py-4 font-medium">
              Log Events
            </p>
            {top10Recentlogs.map((item, index) => (
              <div className="flex items-center gap-4" key={index}>
                <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                  {item.method}
                </p>
                <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                  {item.status}
                </p>
                <p className="text-sm font-mono text-zinc-800 px-6 py-4">
                  {item.createdAt.toDateString()}
                </p>
              </div>
            ))}
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
