/*
  # Create admin OTPs table

  1. New Tables
    - `admin_otps`
      - `id` (uuid, primary key)
      - `email` (text, admin email)
      - `otp_code` (text, the OTP code)
      - `expires_at` (timestamptz, when OTP expires)
      - `used` (boolean, whether OTP has been used)
      - `created_at` (timestamptz, when record was created)

  2. Security
    - Enable RLS on `admin_otps` table
    - Add policy for public access (needed for OTP verification)
*/

CREATE TABLE IF NOT EXISTS admin_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_otps ENABLE ROW LEVEL SECURITY;

-- Allow public access for OTP operations
CREATE POLICY "Allow public access to admin OTPs"
  ON admin_otps
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_otps_email ON admin_otps(email);
CREATE INDEX IF NOT EXISTS idx_admin_otps_code ON admin_otps(otp_code);
CREATE INDEX IF NOT EXISTS idx_admin_otps_expires ON admin_otps(expires_at);