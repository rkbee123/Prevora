/*
  # Create alerts table

  1. New Tables
    - `alerts`
      - `id` (uuid, primary key)
      - `title` (text, alert title/description)
      - `severity` (text, 'low', 'medium', or 'high')
      - `status` (text, 'active', 'inactive', 'resolved', etc.)
      - `location` (text, location where alert applies)
      - `issued_at` (timestamptz, when alert was issued)
      - `created_at` (timestamptz, when record was created)

  2. Security
    - Enable RLS on `alerts` table
    - Add policy for public read access (for dashboard display)
    - Add policy for authenticated users to manage alerts
*/

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'active',
  location text NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read access for dashboard display
CREATE POLICY "Allow public read access to alerts"
  ON alerts
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage alerts
CREATE POLICY "Allow authenticated users to manage alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_alerts_location ON alerts(location);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_issued_at ON alerts(issued_at);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);