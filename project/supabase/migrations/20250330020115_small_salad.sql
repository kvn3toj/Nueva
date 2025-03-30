/*
  # Video Questions Schema

  1. New Tables
    - `video_questions`
      - Stores quiz questions for videos
      - Links questions to specific video timestamps
      - Includes multiple choice options and correct answers

  2. Security
    - Enable RLS
    - Public can view questions
    - Only admins can manage questions
*/

-- Create video questions table
CREATE TABLE IF NOT EXISTS video_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos ON DELETE CASCADE NOT NULL,
  timestamp integer NOT NULL CHECK (timestamp >= 0),
  question text NOT NULL,
  options text[] NOT NULL,
  correct_answer integer NOT NULL CHECK (correct_answer >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE video_questions ENABLE ROW LEVEL SECURITY;

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

-- Create index for better query performance
CREATE INDEX video_questions_video_id_idx ON video_questions(video_id);
CREATE INDEX video_questions_timestamp_idx ON video_questions(timestamp);