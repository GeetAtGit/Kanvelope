// src/components/PremiumButton.jsx
import React from 'react';

const PAYMENT_LINK_URL = 'https://rzp.io/rzp/2XwGjtZ'; // ← replace with your actual payment-link URL

export default function PremiumButton() {
  return (
    <a
      href={PAYMENT_LINK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        px-4 py-2 rounded 
        hover:text-yellow-300 hover:rounded-3xl
        transition
      "
    >
      Unlock Premium ₹499
    </a>
  );
}
