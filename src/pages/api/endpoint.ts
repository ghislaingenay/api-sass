import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import { prismaPool } from "@definitions/PrismaPool";
import { StripeCustomer } from "@/definitions/StripeCustomer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { api_key } = req.query;

  if (!api_key) {
    res.status(401).json({
      error: "Must have a valid api key!",
    });
  }

  const user = await prismaPool.user.findFirst({
    where: {
      api_key: String(api_key),
    },
  });

  if (!user) {
    res.status(401).json({
      error: "There is no user with such api key!",
    });
  }

  const stripe = new StripeCustomer();
  await stripe.retrieveCustomer(String(user?.stripe_customer_id));

  const subscriptions = await stripe.getSubscriptionsByCustomerId(
    String(user?.stripe_customer_id)
  );

  console.log(subscriptions);
  const item = subscriptions.data.at(0)?.items.data.at(0);

  if (!item) {
    res.status(403).json({
      error: "You have no subscription.",
    });
  }

  await stripe.addAPICallToRecordByItemId(item!.id as string);

  const data = randomUUID();

  const log = await prismaPool.log.create({
    data: {
      userId: String(user?.id),
      status: 200,
      method: "GET",
    },
  });

  res.status(200).json({
    status: true,
    special_key: data,
    log: log,
  });
}
