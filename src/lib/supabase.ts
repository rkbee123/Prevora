import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });

  // Create user profile
  if (data.user && !error) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        full_name: userData.full_name || '',
        user_type: userData.user_type || 'user',
        org_name: userData.org_name || '',
        subscribed: userData.subscribed || false,
        is_admin: false
      });
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
    }
  }

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};

// Admin OTP functions
export const sendAdminOTP = async (email: string) => {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP in database
  const { error } = await supabase
    .from('admin_otps')
    .insert({
      email,
      otp_code: otp,
      expires_at: expiresAt.toISOString()
    });

  if (error) {
    return { error };
  }

  // In a real app, you would send this via email service
  // For demo purposes, we'll log it and return success
  console.log(`Admin OTP for ${email}: ${otp}`);
  
  return { data: { message: 'OTP sent successfully' }, error: null };
};

export const verifyAdminOTP = async (email: string, otp: string) => {
  // Check if OTP is valid
  const { data: otpRecord, error } = await supabase
    .from('admin_otps')
    .select('*')
    .eq('email', email)
    .eq('otp_code', otp)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !otpRecord) {
    return { error: { message: 'Invalid or expired OTP' } };
  }

  // Mark OTP as used
  await supabase
    .from('admin_otps')
    .update({ used: true })
    .eq('id', otpRecord.id);

  // Create admin session (simplified for demo)
  // In production, you'd create a proper JWT token
  return { 
    data: { 
      user: { email, is_admin: true },
      message: 'Admin login successful' 
    }, 
    error: null 
  };
};

// Signal management functions
export const createSignal = async (signalData: any) => {
  const { data, error } = await supabase
    .from('signals')
    .insert(signalData)
    .select()
    .single();
  return { data, error };
};

export const getSignals = async (filters: any = {}) => {
  let query = supabase
    .from('signals')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.severity) {
    query = query.eq('severity', filters.severity);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getSignalCount = async () => {
  const { count, error } = await supabase
    .from('signals')
    .select('*', { count: 'exact', head: true });
  return { count, error };
};

// Event management functions
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// Alert management functions
export const getAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('issued_at', { ascending: false });
  return { data, error };
};

// Blog management functions
export const getBlogs = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });
  return { data, error };
};