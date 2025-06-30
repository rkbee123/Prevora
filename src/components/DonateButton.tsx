import React, { useState } from 'react';
import { Heart, Loader } from 'lucide-react';
import { createCheckoutSession } from '../lib/stripe';
import { products } from '../stripe-config';

interface DonateButtonProps {
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
}

const DonateButton: React.FC<DonateButtonProps> = ({ 
  className = '', 
  buttonText = 'Support Our Mission',
  showIcon = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the donation product
      const donationProduct = products[0]; // PREVORA product
      
      if (!donationProduct) {
        throw new Error('Donation product not found');
      }
      
      // Create checkout session
      const { data, error } = await createCheckoutSession({
        priceId: donationProduct.priceId,
        successUrl: `${window.location.origin}/donation-success`,
        cancelUrl: `${window.location.origin}/donation-cancelled`,
        mode: donationProduct.mode
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to process donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDonate}
        disabled={isLoading}
        className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${className}`}
      >
        {isLoading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {showIcon && <Heart className="h-5 w-5" />}
            <span>{buttonText}</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default DonateButton;