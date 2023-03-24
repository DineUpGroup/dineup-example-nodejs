import { NextApiRequest, NextApiResponse } from "next";
import DineUp, { CreateOrderResponse } from "dineup-nodejs";

const dineup = new DineUp("sk_test_...");

let order: CreateOrderResponse;

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query as { path: string[] }

  if (path.join() === "create") {
    console.log("creating");

    // Create a new order on each action that represents the client going to a checkout page
    order = await dineup.createOrder({
      airport_code: "test", // Always use test here as that is the only airport available in the test environment
      flight_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      flight_identifier: "abc-123",
      customer_email: "test@dineup.com",
      customer_first_name: "John",
      customer_last_name: "Appleseed",
      type: "embed", // Currently only embed order type is supported
      embed_view_style: "flat", // Currently only flat view style is supported
    });

    /*

    Store order somewhere...
    
    */

    return res.status(200).json({ client_secret: order.client_secret });
  } else if (path.join() === "confirm") {
    const flight_total = 100;
    // Always get the order details and subtotal from dineup since the client is untrusted
    const { cart_subtotal } = await dineup.getOrder(order.id);
    const total = cart_subtotal + flight_total * 100; // subtotal is in smallest unit currency (for USD it's cents), adjust flight_total to match;

    /*

    Process payment here...
    
    */

    await dineup.confirmOrder(order.id);

    return res.status(200).json({})
  }

  return res.status(400).json({ error: "Invalid path" })

}