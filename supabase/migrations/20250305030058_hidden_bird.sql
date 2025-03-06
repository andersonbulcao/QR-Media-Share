/*
  # Initial Schema Setup

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `qr_code` (text)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)
    
    - `media`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `type` (text)
      - `url` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  qr_code text UNIQUE,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('photo', 'video')),
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Media policies
CREATE POLICY "Users can create media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read media from their events"
  ON media
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM events WHERE id = media.event_id
    )
  );

CREATE POLICY "Users can delete their own media"
  ON media
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);