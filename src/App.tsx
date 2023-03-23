import { useEffect, useState } from 'react'
import './App.css'
import DineUp from '@dineupgroup/clientjs';

const dineup = new DineUp();

function App() {
  const [order_items, setOrderItems] = useState({ subtotal: 0 })
  const [client_secret, setClientSecret] = useState('');

  useEffect(() => {
    fetch("http://localhost:5000/create")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret);
      });

    dineup.init(client_secret);
  }, [])

  const onCheckout = () => {
    fetch("http://localhost:5000/confirm", {
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
          <div id="dineup-order-react" />
        </div>
        <div>
          <h2>
            Cart
          </h2>
          <div className='column'>
            <p>LAX - SFO</p>
            <p>$100</p>
          </div>
          {/* This div is where we inject the line items from the callback */}
          <div id="dineup-checkout-react" />
          <div className='column'>
            <p><b>Total</b></p>
            <p>${100 + order_items.subtotal || 0}</p>
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
