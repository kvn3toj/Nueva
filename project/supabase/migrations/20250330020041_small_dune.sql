/*
  # Analytics and Video System Schema

  1. New Tables
    - `videos`
      - Core video content table
      - Stores video metadata and URLs
    
    - `video_progress`
      - Tracks user progress in videos
      - Stores watch time and completion percentage
    
    - `quiz_results`
      - Stores user quiz performance
      - Tracks scores and completion dates

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Public can view videos
*/

-- Create videos table first
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

-- Create video progress table
CREATE TABLE IF NOT EXISTS video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  video_id uuid REFERENCES videos ON DELETE CASCADE NOT NULL,
  progress numeric NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  watch_time integer NOT NULL DEFAULT 0 CHECK (watch_time >= 0),
  last_watched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  video_id uuid REFERENCES videos ON DELETE CASCADE NOT NULL,
  score numeric NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions integer NOT NULL CHECK (total_questions > 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies for videos
CREATE POLICY "Anyone can view videos"
  ON videos
  FOR SELECT
  TO public
  USING (true);

-- Policies for video progress
CREATE POLICY "Users can view their own progress"
  ON video_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON video_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their progress"
  ON video_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for quiz results
CREATE POLICY "Users can view their own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX video_progress_user_id_idx ON video_progress(user_id);
CREATE INDEX video_progress_video_id_idx ON video_progress(video_id);
CREATE INDEX quiz_results_user_id_idx ON quiz_results(user_id);
CREATE INDEX quiz_results_video_id_idx ON quiz_results(video_id);

-- Create trigger for updated_at
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();