/*
  # Create signals table

  1. New Tables
    - `signals`
      - `id` (uuid, primary key)
      - `type` (text, signal type like 'Cough', 'Fever', etc.)
      - `location` (text, location description)
      - `latitude` (double precision, optional GPS coordinate)
      - `longitude` (double precision, optional GPS coordinate)
      - `severity` (text, 'low', 'medium', or 'high')
      - `notes` (text, optional additional information)
      - `timestamp` (timestamptz, when the signal occurred)
      - `created_at` (timestamptz, when record was created)

  2. Security
    - Enable RLS on `signals` table
    - Add policy for public read access (for dashboard display)
    - Add policy for public insert access (for signal submission)
*/

CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  location text NOT NULL,
  latitude double precision,
  longitude double precision,
  severity text NOT NULL DEFAULT 'medium',
  notes text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

-- Allow public read access for dashboard display
CREATE POLICY "Allow public read access to signals"
  ON signals
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert access for signal submission
CREATE POLICY "Allow public insert access to signals"
  ON signals
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_signals_location ON signals(location);
CREATE INDEX IF NOT EXISTS idx_signals_type ON signals(type);
CREATE INDEX IF NOT EXISTS idx_signals_severity ON signals(severity);
CREATE INDEX IF NOT EXISTS idx_signals_timestamp ON signals(timestamp);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON signals(created_at);