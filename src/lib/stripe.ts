// Stripe API client for Prevora
import { supabase } from './supabase';

// Stripe checkout session types
export interface CheckoutOptions {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  mode: 'payment' | 'subscription';
}

// Create a checkout session
export const createCheckoutSession = async (options: CheckoutOptions) => {
  try {
    const { priceId, successUrl, cancelUrl, mode } = options;
    
    // Get the current user's auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be logged in to create a checkout session');
    }
    
    // Call the Supabase Edge Function to create a checkout session
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { data: null, error: { message: error.message } };
  }
};

// Get customer subscription status
export const getCustomerSubscription = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }
    
    // Get customer ID from stripe_customers table
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single();
    
    if (customerError || !customerData) {
      return { data: null, error: null }; // No error, just no subscription yet
    }
    
    // Get subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('stripe_subscriptions')
      .select('*')
      .eq('customer_id', customerData.customer_id)
      .single();
    
    if (subscriptionError) {
      return { data: null, error: { message: 'Failed to fetch subscription data' } };
    }
    
    return { data: subscriptionData, error: null };
  } catch (error: any) {
    console.error('Error getting customer subscription:', error);
    return { data: null, error: { message: error.message } };
  }
};

// Get customer orders
export const getCustomerOrders = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }
    
    // Get customer ID from stripe_customers table
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single();
    
    if (customerError || !customerData) {
      return { data: [], error: null }; // No error, just no orders yet
    }
    
    // Get orders data
    const { data: ordersData, error: ordersError } = await supabase
      .from('stripe_orders')
      .select('*')
      .eq('customer_id', customerData.customer_id)
      .order('created_at', { ascending: false });
    
    if (ordersError) {
      return { data: null, error: { message: 'Failed to fetch orders data' } };
    }
    
    return { data: ordersData, error: null };
  } catch (error: any) {
    console.error('Error getting customer orders:', error);
    return { data: null, error: { message: error.message } };
  }
};