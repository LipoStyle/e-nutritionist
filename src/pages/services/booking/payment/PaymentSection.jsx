import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentSection = ({ onPaymentSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount } = location.state || {};

  if (!bookingId || !amount) {
    return <div>Error: Missing order information.</div>;
  }

  const handlePaymentSuccess = (paymentResult) => {
    onPaymentSuccess(paymentResult);
    navigate('/success'); // Navigate to a success page after payment
  };

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm bookingId={bookingId} amount={amount} onPaymentSuccess={handlePaymentSuccess} />
    </Elements>
  );
};

export default PaymentSection;
