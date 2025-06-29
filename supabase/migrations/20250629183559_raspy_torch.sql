/*
  # Create blogs table

  1. New Tables
    - `blogs`
      - `id` (uuid, primary key)
      - `title` (text, blog title)
      - `content` (text, blog content)
      - `author` (text, blog author)
      - `published` (boolean, publication status)
      - `published_at` (timestamptz, when published)
      - `created_at` (timestamptz, when record was created)

  2. Security
    - Enable RLS on `blogs` table
    - Add policy for public read access to published blogs
    - Add policy for authenticated users to manage blogs
*/

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Allow public read access to published blogs"
  ON blogs
  FOR SELECT
  TO public
  USING (published = true);

-- Allow authenticated users to manage blogs
CREATE POLICY "Allow authenticated users to manage blogs"
  ON blogs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);