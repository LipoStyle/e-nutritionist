import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import './payment.css'; // Assuming you have this CSS file for styles

import visa from "../../../../images/servicesimages/paymentIcon/visa.svg";
import mastercard from "../../../../images/servicesimages/paymentIcon/master-card.svg";

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com'; // Update with your actual backend URL
const API_Local_Host = 'http://localhost:3000';

const CheckoutForm = ({ bookingId, amount, onPaymentSuccess }) => {
  const url = API_BASE_URL;

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      const cardElement = elements.getElement(CardNumberElement);
      const expiryElement = elements.getElement(CardExpiryElement);
      const cvcElement = elements.getElement(CardCvcElement);

      const allFieldsValid = cardElement && expiryElement && cvcElement;
      setIsFormValid(allFieldsValid);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const paymentIntentResponse = await fetch(`${url}/payments/create_payment_intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: amount, // In cents
        }),
      });

      if (!paymentIntentResponse.ok) {
        throw new Error('Failed to create Payment Intent');
      }

      const { clientSecret } = await paymentIntentResponse.json();
      const cardNumberElement = elements.getElement(CardNumberElement);

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });

      if (stripeError) {
        setError(`Payment failed: ${stripeError.message}`);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      } else {
        setError('Payment processing error, please try again.');
      }
    } catch (error) {
      setError(`Payment failed: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="payment-container">
      <div className="payment-container-background"></div> {/* Background wrapper */}
      <div className="payment-card">
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="card-icons">
            <img src={visa} alt="Visa" />
            <img src={mastercard} alt="MasterCard" />
          </div>

          <h2 className="payment-title">Complete Your Payment</h2>

          <div className="form-field">
            <label htmlFor="card-number-element" className="card-label">Card Number</label>
            <CardNumberElement className="card-element" />
          </div>

          <div className="form-field">
            <label htmlFor="card-expiry-element" className="card-label">Expiration Date</label>
            <CardExpiryElement className="card-element" />
          </div>

          <div className="form-field">
            <label htmlFor="card-cvc-element" className="card-label">CVC</label>
            <CardCvcElement className="card-element" />
          </div>

          <button type="submit" className="payment-button" disabled={!isFormValid || loading}>
            {loading ? <Spinner /> : `Pay €${(amount / 100).toFixed(2)}`}
          </button>

          {error && <div className="error-message">{error}</div>}

          <p className="secure-message">Your payment information is encrypted and secure.</p>
        </form>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="spinner">
    <div className="double-bounce1"></div>
    <div className="double-bounce2"></div>
  </div>
);

export default CheckoutForm;
