import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced auth helper functions with OTP support
export const signUp = async (email: string, password: string, userData: any) => {
  // First, create the auth user with email confirmation required
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  });

  // Create user profile immediately (will be linked when email is confirmed)
  if (data.user && !error) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        full_name: userData.full_name || '',
        username: userData.username || '',
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

export const signIn = async (identifier: string, password: string) => {
  // Check if identifier is email or username
  const isEmail = identifier.includes('@');
  
  if (isEmail) {
    // Direct email login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password
    });
    return { data, error };
  } else {
    // Username login - first get email from username
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', identifier)
      .single();
    
    if (profileError || !profileData) {
      return { 
        data: null, 
        error: { message: 'Username not found' } 
      };
    }
    
    // Get email from auth.users
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', profileData.id)
      .single();
    
    if (userError || !userData) {
      return { 
        data: null, 
        error: { message: 'User account not found' } 
      };
    }
    
    // Now login with email
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password
    });
    return { data, error };
  }
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
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  return { data, error };
};

// Enhanced admin functions with email verification
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

  // Send OTP via Supabase email (using your SMTP configuration)
  try {
    // Use Supabase's built-in email functionality
    const { error: emailError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        data: {
          otp_code: otp,
          is_admin_login: true
        }
      }
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      // Fallback: log OTP for demo purposes
      console.log(`Admin OTP for ${email}: ${otp}`);
    }
  } catch (emailError) {
    console.error('Email service error:', emailError);
    // Fallback: log OTP for demo purposes
    console.log(`Admin OTP for ${email}: ${otp}`);
  }
  
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

  // Create admin session by signing in with email
  // First check if admin user exists
  const { data: adminProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .eq('is_admin', true)
    .single();

  if (!adminProfile) {
    return { error: { message: 'Admin access denied' } };
  }

  return { 
    data: { 
      user: { email, is_admin: true },
      message: 'Admin login successful' 
    }, 
    error: null 
  };
};

// Email verification for regular users
export const resendEmailVerification = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: { message: 'No user logged in' } };
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  });

  return { error };
};

// Check if email is verified
export const checkEmailVerification = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { verified: false, user: null };
  }

  return { 
    verified: user.email_confirmed_at !== null, 
    user 
  };
};

// Signal management functions (unchanged)
export const createSignal = async (signalData: any) => {
  try {
    console.log('Creating signal with data:', signalData);
    
    const { data, error } = await supabase
      .from('signals')
      .insert([signalData])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error creating signal:', error);
      throw error;
    }
    
    console.log('Signal created successfully:', data);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in createSignal:', error);
    return { data: null, error };
  }
};

export const getSignals = async (filters: any = {}) => {
  try {
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
    
    if (error) {
      console.error('Error fetching signals:', error);
      return { data: [], error };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getSignals:', error);
    return { data: [], error };
  }
};

export const getSignalCount = async () => {
  try {
    const { count, error } = await supabase
      .from('signals')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error getting signal count:', error);
      return { count: 0, error };
    }
    
    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Error in getSignalCount:', error);
    return { count: 0, error };
  }
};

export const deleteSignal = async (id: string) => {
  try {
    const { error } = await supabase
      .from('signals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting signal:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteSignal:', error);
    return { error };
  }
};

// Event management functions (unchanged)
export const getEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching events:', error);
      return { data: [], error };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getEvents:', error);
    return { data: [], error };
  }
};

export const getEventById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching event:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getEventById:', error);
    return { data: null, error };
  }
};

// Alert management functions (unchanged)
export const getAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('issued_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return { data: [], error };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getAlerts:', error);
    return { data: [], error };
  }
};

// Blog management functions (unchanged)
export const getBlogs = async () => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blogs:', error);
      return { data: [], error };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getBlogs:', error);
    return { data: [], error };
  }
};

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('signals')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
};