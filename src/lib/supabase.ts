import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced auth helper functions with OTP support
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    // First, create the auth user with email confirmation required
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }

    // Create user profile immediately (will be linked when email is confirmed)
    if (data.user) {
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

    return { data, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { data: null, error: { message: 'An unexpected error occurred during signup' } };
  }
};

export const signIn = async (identifier: string, password: string) => {
  try {
    // Check if identifier is email or username
    const isEmail = identifier.includes('@');
    
    if (isEmail) {
      // Direct email login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } else {
      // Username login - first get user by username
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
      
      // Get email from auth.users using RPC function or direct query
      // Since we can't directly query auth.users, we'll use the user ID to get the email
      // This requires the user to have confirmed their email first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        // Try to get user by profile ID (this is a workaround)
        return { 
          data: null, 
          error: { message: 'Please use your email address to login' } 
        };
      }
      
      // For now, return error asking user to use email
      return { 
        data: null, 
        error: { message: 'Please use your email address to login' } 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { data: null, error: { message: 'An unexpected error occurred during login' } };
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

// Enhanced admin functions with email verification and demo OTP
export const sendAdminOTP = async (email: string) => {
  try {
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
      console.error('Error storing OTP:', error);
      return { error };
    }

    // For demo purposes, always use 123456 as the OTP
    const demoOtp = '123456';
    
    // Store demo OTP as well
    await supabase
      .from('admin_otps')
      .insert({
        email,
        otp_code: demoOtp,
        expires_at: expiresAt.toISOString()
      });

    // Log OTP for demo purposes (in production, this would be sent via email)
    console.log(`Admin OTP for ${email}: ${otp} (or use demo OTP: 123456)`);
    
    return { data: { message: 'OTP sent successfully' }, error: null };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { error: { message: 'Failed to send OTP' } };
  }
};

export const verifyAdminOTP = async (email: string, otp: string) => {
  try {
    // Check if OTP is valid (including demo OTP 123456)
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

    // For demo purposes, create a temporary admin session
    // In a real app, you'd create a proper session or JWT token
    const adminSession = {
      email,
      is_admin: true,
      verified_at: new Date().toISOString()
    };

    // Store admin session in localStorage for demo
    localStorage.setItem('admin_session', JSON.stringify(adminSession));

    return { 
      data: { 
        user: adminSession,
        message: 'Admin login successful' 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { error: { message: 'Failed to verify OTP' } };
  }
};

// Email verification for regular users
export const resendEmailVerification = async () => {
  try {
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
  } catch (error) {
    console.error('Error resending verification:', error);
    return { error: { message: 'Failed to resend verification email' } };
  }
};

// Check if email is verified
export const checkEmailVerification = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { verified: false, user: null };
    }

    return { 
      verified: user.email_confirmed_at !== null, 
      user 
    };
  } catch (error) {
    console.error('Error checking email verification:', error);
    return { verified: false, user: null };
  }
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