import { useEffect, useState } from 'react'
import { DineUp } from "dineup-clientjs";
import { Order } from 'dineup-clientjs/dist/client-types';

const dineup = new DineUp({
  element: "dineup-order-element"
});

function App() {
  const [order, setOrder] = useState<Order>({ subtotal: 0, line_items: [] })

  useEffect(() => {
    fetch("api/create")
      .then((res) => res.json())
      .then((data) => {
        dineup.init(data.client_secret, setOrder);
      });
  }, [])

  const onCheckout = () => {
    fetch("api/confirm", {
      method: "POST",
    });
  }

  return (
    <div className="App">
      <h1>React Example</h1>
      <div className='container'>
        <div>
          <h2>
            Select your onboard meal
          </h2>
          {/* This div is where we inject the DineUp order iframe */}
          <div id="dineup-order-element" />
        </div>
        <div>
          <h2>
            Cart
          </h2>
          <div className='row' style={{ marginBottom: "1rem" }}>
            <b>LAX - SFO</b>
            <p>$100.00</p>
          </div>
          {
            order.line_items.map((item, index) => {
              return (
                <div className='row food' key={index}>
                  <div className='item-desc'>
                    <span>{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <p>{(item.amount * item.quantity / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                </div>
              )
            })
          }
          <div className='row' style={{ marginTop: "1rem" }}>
            <p><b>Total</b></p>
            <p><b>{(100 + order.subtotal / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</b></p>
          </div>
        </div>
      </div>
      <button onClick={() => onCheckout()}>
        Checkout
      </button>
    </div>
  )
}

export default App
