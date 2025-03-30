/*
  # Video System Schema

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `url` (text)
      - `thumbnail_url` (text)
      - `duration` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `video_questions`
      - `id` (uuid, primary key)
      - `video_id` (uuid, references videos)
      - `timestamp` (integer)
      - `question` (text)
      - `options` (text array)
      - `correct_answer` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public video access
    - Add policies for admin video management
*/

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  thumbnail_url text,
  duration integer NOT NULL CHECK (duration > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create video questions table
CREATE TABLE IF NOT EXISTS video_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos ON DELETE CASCADE NOT NULL,
  timestamp integer NOT NULL CHECK (timestamp >= 0),
  question text NOT NULL,
  options text[] NOT NULL,
  correct_answer integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_questions ENABLE ROW LEVEL SECURITY;

-- Policies for videos
CREATE POLICY "Anyone can view videos"
  ON videos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.email() IN ('admin@example.com')
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.email() IN ('admin@example.com')
  ));

-- Policies for video questions
CREATE POLICY "Anyone can view video questions"
  ON video_questions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage video questions"
  ON video_questions
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.email() IN ('admin@example.com')
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.email() IN ('admin@example.com')
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();