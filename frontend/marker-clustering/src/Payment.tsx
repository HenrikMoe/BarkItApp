import React, { useState, useEffect } from 'react';

type PaymentProps = {
  title: string;
  price: number;
  username: string;
  interactingUsername: string;
};

const Payment: React.FC<PaymentProps> = ({ title, price, username, interactingUsername }) => {
  const [paymentMethod, setPaymentMethod] = useState<'applePay' | 'creditCard' | null>(null);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    const loadStripe = async () => {
      // Load Stripe.js asynchronously
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/';
      stripeScript.async = true;
      stripeScript.onload = () => {
        setStripe(window.Stripe(process.env.STRIPE_SECRET_KEY));
      };
      document.body.appendChild(stripeScript);

      return () => {
        document.body.removeChild(stripeScript);
      };
    };

    loadStripe();
  }, []);

  const handlePayment = async () => {
    try {
      if (stripe && paymentMethod) {
        const { token, error } = await stripe.createToken(paymentMethod === 'creditCard' ? 'card' : 'applePay');

        if (error) {
          // Handle error
          console.error('Stripe token creation error:', error);
        } else {
          // Send the token and user information to your backend for further processing
          await fetch('http://localhost:3029/charge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              amount: price,
              username,
              interactingUsername,
            }),
          });
        }
      }
    } catch (error) {
      console.error('Error handling payment:', error);
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>Price: ${price.toFixed(2)}</p>

      <div>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="applePay"
            checked={paymentMethod === 'applePay'}
            onChange={() => setPaymentMethod('applePay')}
          />
          Apple Pay
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="creditCard"
            checked={paymentMethod === 'creditCard'}
            onChange={() => setPaymentMethod('creditCard')}
          />
          Credit Card
        </label>
      </div>

      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

export default Payment;
