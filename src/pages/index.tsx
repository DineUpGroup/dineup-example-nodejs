import { useEffect, useState } from 'react'
import { DineUp, ClientOrder } from "dineup-clientjs";

const dineup = new DineUp({
  element: "dineup-order-element",
  live_mode: false
});

function App() {
  const [order, setOrder] = useState<ClientOrder>({ line_items: [] })
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

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
    }).then(async (res) => {
      if (res.status === 200) {
        setSuccess(true);
        setError("")
      } else {
        const body = await res.json();
        setError(body.error);
        setSuccess(false);
      }
    });;
  }

  const subtotal = order.line_items.reduce((acc, item) => {
    return acc + item.amount * item.quantity
  }, 0)

  return (
    <div className="App">
      <h1>Checkout Example</h1>
      <div className='container'>
        <div style={{ width: "30rem" }}>
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
            <p><b>{(100 + subtotal / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</b></p>
          </div>
        </div>
      </div>
      <button onClick={() => onCheckout()}>
        Checkout
      </button>
      {success && <h3 >Success! Your flight is booked</h3>}
      {error && <div>{error}</div>}
    </div>
  )
}

export default App
