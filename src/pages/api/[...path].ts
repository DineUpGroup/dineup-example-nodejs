import { NextApiRequest, NextApiResponse } from "next";
import DineUp, { Order, OrderState } from "dineup-nodejs";

const dineup = new DineUp("your_api_key");

let order: Order | undefined;

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query as { path: string[] }

  if (path.join() === "create") {

    if (!order || order.state === OrderState.Paid) {
      // Create a new order on each action that represents the customer going to a checkout/booking page
      order = await dineup.createOrder({
        airport_code: "TEST", // Always use TEST here as that is the only airport available in the test environment
        flight_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        flight_identifier: "AB123",
        customer_email: "test@dineup.com",
        customer_first_name: "John",
        customer_last_name: "Appleseed",
        type: "embed", // Currently only embed order type is supported
        embed_view_style: "flat", // Currently only flat view style is supported
      });

      /*
  
      Store order somewhere...
      
      */

    }
    return res.status(200).json({ client_secret: order.client_secret });
  } else if (path.join() === "confirm") {
    if (!order) {
      return res.status(400).json({ error: "No order" });
    }

    const flight_total = 100;
    // Always get the order details and subtotal from dineup since the client is untrusted
    const { cart_line_items } = await dineup.getOrder(order.id);
    const subtotal = cart_line_items.reduce((acc, item) => acc + item.amount * item.quantity, 0);
    const total = subtotal + flight_total * 100; // subtotal is in smallest unit currency (for USD it's cents), adjust flight_total to match;

    /*

    Process payment here...
    
    */

    try {
      order = await dineup.confirmOrder(order.id);

    } catch {
      return res.status(400).json({ error: "Order confirmation failed" });
    }

    console.log(order);

    return res.status(200).json({})
  }

  return res.status(400).json({ error: "Invalid path" })

}
