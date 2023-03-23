var http = require("http");

var Dineup = require("@dineupgroup/nodejs");

const dineup = new DineUp("<api_key>");

let order;

var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  if (req.url == "/create") {
    // Create a new order on each action that represents the client going to a checkout page
    order = dineup.createOrder({
      airport_code: "abc",
      flight_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      flight_identifier: "def-123",
      customer_email: "example@dineup.com",
      customer_first_name: "John",
      customer_last_name: "Appleseed",
      type: "embed",
      embed_view_style: "flat",
    });

    res.write(JSON.stringify({ client_secret: order.client_secret }));
    res.end();
  } else if (req.url == "/confirm") {
    const flight_total = 100;
    // Always get the order details and subtotal from dineup for a particular order, since the client is untrusted
    const { cart_subtotal } = dineup.getOrder(order.id);
    const total = cart_subtotal + flight_total * 100; // subtotal is in smallest unit currency, adjust flight_total to match;

    /*

    Process payment here...
    
    */

    dineup.confirmOrder(order.id);

    res.write("");
    res.end();
  } else res.end("Invalid Request!");
});

server.listen(5000); //3 - listen for any incoming requests

console.log("Node.js web server at port 5000 is running..");
