/*
  # Create places table for historical locations

  1. New Tables
    - `places`
      - `id` (uuid, primary key)
      - `image_url` (text)
      - `latitude` (float8)
      - `longitude` (float8)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `places` table
    - Add policies for authenticated users to:
      - Read all places
      - Create their own places
      - Update their own places
      - Delete their own places
*/

CREATE TABLE places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Allow users to read all places
CREATE POLICY "Users can read all places"
  ON places
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own places
CREATE POLICY "Users can create their own places"
  ON places
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own places
CREATE POLICY "Users can update their own places"
  ON places
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own places
CREATE POLICY "Users can delete their own places"
  ON places
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);