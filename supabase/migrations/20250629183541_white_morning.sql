/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, event title/description)
      - `location` (text, location where event occurred)
      - `event_type` (text, type of event)
      - `severity` (text, 'low', 'medium', or 'high')
      - `status` (text, 'active', 'monitoring', 'resolved', etc.)
      - `signal_count` (integer, number of related signals)
      - `description` (text, detailed description)
      - `created_at` (timestamptz, when record was created)

  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access (for dashboard display)
    - Add policy for authenticated users to manage events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  event_type text NOT NULL DEFAULT 'outbreak',
  severity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'active',
  signal_count integer DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public read access for dashboard display
CREATE POLICY "Allow public read access to events"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage events
CREATE POLICY "Allow authenticated users to manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_severity ON events(severity);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);