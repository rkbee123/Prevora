/*
  # Disease Intelligence System Database Schema

  1. New Tables
    - `signals` - Raw health signals from various sources
    - `events` - Aggregated events from multiple signals
    - `alerts` - Public health alerts based on events
    - `blogs` - Auto-generated blog posts about events
    - `admin_otps` - OTP codes for admin authentication

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for users and admins
    - Secure admin access with OTP system

  3. Functions
    - Auto-increment signal counts
    - Event generation triggers
    - Alert creation automation
*/

-- Create signals table
CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  location text NOT NULL,
  latitude float,
  longitude float,
  timestamp timestamptz DEFAULT now(),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  latitude float,
  longitude float,
  type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'resolved')),
  signal_ids uuid[],
  signal_count integer DEFAULT 0,
  anomaly_score float DEFAULT 0,
  confidence float DEFAULT 0,
  affected_population integer DEFAULT 0,
  summary text,
  description text,
  recommendations text[],
  precautions text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id),
  title text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'resolved')),
  description text,
  recommendations text[],
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id),
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  location text NOT NULL,
  type text NOT NULL,
  severity text NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create admin_otps table
CREATE TABLE IF NOT EXISTS admin_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  user_type text,
  org_name text,
  subscribed boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for signals
CREATE POLICY "Anyone can read signals"
  ON signals
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert signals"
  ON signals
  FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update signals"
  ON signals
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for events
CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "System can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for alerts
CREATE POLICY "Anyone can read alerts"
  ON alerts
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "System can manage alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for blogs
CREATE POLICY "Anyone can read published blogs"
  ON blogs
  FOR SELECT
  TO authenticated, anon
  USING (published = true);

CREATE POLICY "Admins can manage blogs"
  ON blogs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for admin_otps
CREATE POLICY "Admins can manage OTPs"
  ON admin_otps
  FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "System can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  USING (true);

-- Function to auto-create events when signals reach threshold
CREATE OR REPLACE FUNCTION check_signal_threshold()
RETURNS TRIGGER AS $$
DECLARE
  signal_count INTEGER;
  event_exists BOOLEAN;
  new_event_id UUID;
BEGIN
  -- Count signals in the same location within last 24 hours
  SELECT COUNT(*) INTO signal_count
  FROM signals
  WHERE location = NEW.location
    AND created_at >= NOW() - INTERVAL '24 hours';

  -- Check if event already exists for this location
  SELECT EXISTS(
    SELECT 1 FROM events
    WHERE location = NEW.location
      AND status = 'active'
      AND created_at >= NOW() - INTERVAL '24 hours'
  ) INTO event_exists;

  -- Create event if threshold reached and no existing event
  IF signal_count >= 5 AND NOT event_exists THEN
    INSERT INTO events (
      title,
      location,
      latitude,
      longitude,
      type,
      severity,
      signal_count,
      anomaly_score,
      confidence,
      affected_population,
      summary,
      description,
      recommendations,
      precautions
    ) VALUES (
      NEW.type || ' cluster detected - ' || NEW.location,
      NEW.location,
      NEW.latitude,
      NEW.longitude,
      NEW.type,
      CASE 
        WHEN signal_count >= 15 THEN 'high'
        WHEN signal_count >= 10 THEN 'medium'
        ELSE 'low'
      END,
      signal_count,
      LEAST(signal_count * 0.1, 1.0),
      GREATEST(0.7, LEAST(signal_count * 0.05, 0.95)),
      signal_count * 1000,
      'Unusual spike in ' || NEW.type || ' signals detected in ' || NEW.location,
      'Multiple ' || NEW.type || ' signals have been detected in ' || NEW.location || ' area, indicating potential health concern.',
      ARRAY[
        'Monitor symptoms closely',
        'Practice good hygiene',
        'Avoid crowded areas if possible',
        'Seek medical attention if symptoms develop'
      ],
      ARRAY[
        'Local health authorities have been notified',
        'Monitoring systems are active',
        'Additional testing may be recommended'
      ]
    ) RETURNING id INTO new_event_id;

    -- Create corresponding alert
    INSERT INTO alerts (
      event_id,
      title,
      location,
      type,
      severity,
      description,
      recommendations
    ) VALUES (
      new_event_id,
      NEW.type || ' Alert - ' || NEW.location,
      NEW.location,
      NEW.type,
      CASE 
        WHEN signal_count >= 15 THEN 'high'
        WHEN signal_count >= 10 THEN 'medium'
        ELSE 'low'
      END,
      'Health alert issued for ' || NEW.location || ' due to increased ' || NEW.type || ' signals.',
      ARRAY[
        'Stay informed about local health updates',
        'Follow recommended health precautions',
        'Report symptoms to healthcare providers'
      ]
    );

    -- Create blog post
    INSERT INTO blogs (
      event_id,
      title,
      content,
      summary,
      location,
      type,
      severity,
      published
    ) VALUES (
      new_event_id,
      'Health Alert: ' || NEW.type || ' signals spike in ' || NEW.location,
      'Our monitoring system has detected an unusual increase in ' || NEW.type || ' signals in the ' || NEW.location || ' area. This early warning indicates potential health concerns that warrant attention and preventive measures.',
      'Increased ' || NEW.type || ' activity detected in ' || NEW.location || ' - early warning issued.',
      NEW.location,
      NEW.type,
      CASE 
        WHEN signal_count >= 15 THEN 'high'
        WHEN signal_count >= 10 THEN 'medium'
        ELSE 'low'
      END,
      true
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for signal threshold checking
DROP TRIGGER IF EXISTS signal_threshold_trigger ON signals;
CREATE TRIGGER signal_threshold_trigger
  AFTER INSERT ON signals
  FOR EACH ROW
  EXECUTE FUNCTION check_signal_threshold();

-- Function to update event signal counts
CREATE OR REPLACE FUNCTION update_event_signal_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET 
    signal_count = (
      SELECT COUNT(*) 
      FROM signals 
      WHERE location = NEW.location 
        AND created_at >= NOW() - INTERVAL '24 hours'
    ),
    updated_at = NOW()
  WHERE location = NEW.location 
    AND status = 'active'
    AND created_at >= NOW() - INTERVAL '24 hours';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating signal counts
DROP TRIGGER IF EXISTS update_signal_count_trigger ON signals;
CREATE TRIGGER update_signal_count_trigger
  AFTER INSERT ON signals
  FOR EACH ROW
  EXECUTE FUNCTION update_event_signal_count();