// Stripe product configuration for Prevora

export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
  interval?: 'month' | 'year';
  features?: string[];
}

// Stripe products configuration
export const products: StripeProduct[] = [
  {
    priceId: 'price_1OvXYZXYZXYZXYZXYZXYZXYZ', // Replace with your actual Stripe price ID
    name: 'PREVORA',
    description: 'Support our mission to detect outbreaks before they spread',
    price: 100,
    currency: 'AUD',
    mode: 'payment',
    features: [
      'Support early disease detection research',
      'Help expand our prevention network',
      'Contribute to global health security',
      'Enable AI-powered health intelligence'
    ]
  }
];

// Get product by price ID
export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return products.find(product => product.priceId === priceId);
};

// Format currency
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};