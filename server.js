import http from "http";

import DineUp from "dineup-nodejs";

const dineup = new DineUp("<api_key>");

let order;

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  if (req.url == "/create") {
    // Create a new order on each action that represents the client going to a checkout page
    order = dineup.createOrder({
      airport_code: "test", // Always use test here as that is the only airport available in the test environment
      flight_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      flight_identifier: "abc-123",
      customer_email: "<email you wish to receive test emails at>",
      customer_first_name: "John",
      customer_last_name: "Appleseed",
      type: "embed", // Currently only embed order type is supported
      embed_view_style: "flat", // Currently only flat view style is supported
    });

    res.write(JSON.stringify({ client_secret: order.client_secret }));
    res.end();
  } else if (req.url == "/confirm") {
    const flight_total = 100;
    // Always get the order details and subtotal from dineup since the client is untrusted
    const { cart_subtotal } = dineup.getOrder(order.id);
    const total = cart_subtotal + flight_total * 100; // subtotal is in smallest unit currency (for USD it's cents), adjust flight_total to match;

    /*

    Process payment here...
    
    */

    dineup.confirmOrder(order.id);

    res.write("");
    res.end();
  } else {
    res.end("Invalid Request!");
  }
});

server.listen(5000); //3 - listen for any incoming requests

console.log("Node.js web server at port 5000 is running..");
