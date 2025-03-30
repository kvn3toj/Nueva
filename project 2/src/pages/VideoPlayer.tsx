import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, Subtitles, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { VideoOnboarding } from '../components/VideoOnboarding';
import type { VideoQuestion } from '../lib/types';

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  duration: number;
}

export function VideoPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState<VideoQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [questions, setQuestions] = useState<VideoQuestion[]>([]);
  const [progress, setProgress] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('720p');
  const [showSubtitles, setShowSubtitles] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideoData();
      fetchVideoQuestions();
    }
  }, [id]);

  useEffect(() => {
    if (user && videoData) {
      fetchVideoProgress();
    }
  }, [user, videoData]);

  async function fetchVideoData() {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVideoData(data);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  }

  async function fetchVideoQuestions() {
    try {
      const { data, error } = await supabase
        .from('video_questions')
        .select('*')
        .eq('video_id', id)
        .order('timestamp');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  async function fetchVideoProgress() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('video_progress')
        .select('progress, watch_time')
        .eq('video_id', id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProgress(data.progress);
        if (videoRef.current) {
          videoRef.current.currentTime = data.progress * videoRef.current.duration;
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }

  async function updateProgress(currentProgress: number, watchTime: number) {
    if (!user || !videoData) return;

    try {
      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoData.id,
          progress: currentProgress,
          watch_time: watchTime,
          last_watched_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  async function submitQuizResult(score: number, totalQuestions: number) {
    if (!user || !videoData) return;

    try {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          video_id: videoData.id,
          score,
          total_questions: totalQuestions
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, [videoRef.current]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (videoRef.current && !activeQuestion) {
        const currentProgress = videoRef.current.currentTime / videoRef.current.duration;
        setCurrentTime(videoRef.current.currentTime);
        setProgress(currentProgress);
        updateProgress(currentProgress, Math.floor(videoRef.current.currentTime));
        
        // Check for questions at current timestamp
        const question = questions.find(
          q => Math.abs(q.timestamp - videoRef.current!.currentTime) < 1 && 
          !activeQuestion
        );
        
        if (question) {
          setIsPlaying(false);
          videoRef.current.pause();
          setActiveQuestion(question);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, activeQuestion]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const handleTimeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelection = async (answerIndex: number) => {
    if (!activeQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const isCorrect = answerIndex === activeQuestion.correct_answer;
    await submitQuizResult(isCorrect ? 100 : 0, 1);

    setTimeout(() => {
      setActiveQuestion(null);
      setSelectedAnswer(null);
      setShowFeedback(false);
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 3000);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('videoOnboardingComplete', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('videoOnboardingComplete', 'true');
  };

  const qualities = ['1080p', '720p', '480p', '360p'];

  if (!videoData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative bg-black rounded-lg overflow-hidden group video-container">
        {showOnboarding && (
          <VideoOnboarding
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        )}

        {/* Video */}
        <video
          ref={videoRef}
          className="w-full aspect-video"
          poster={videoData?.thumbnail_url}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <source src={videoData?.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="progress-bar">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => handleTimeUpdate(e)}
              className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="play-button text-white hover:text-gray-300">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              {/* Skip Buttons */}
              <button
                onClick={() => skipTime(-10)}
                className="text-white hover:text-gray-300"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => skipTime(10)}
                className="text-white hover:text-gray-300"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Volume Control */}
              <div className="volume-control flex items-center space-x-2">
                <button onClick={toggleMute} className="text-white hover:text-gray-300">
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Time Display */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Subtitles */}
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className="subtitles-button text-white hover:text-gray-300"
              >
                <Subtitles className="w-5 h-5" />
              </button>

              {/* Quality Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="settings-button text-white hover:text-gray-300"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2">
                    {qualities.map((quality) => (
                      <button
                        key={quality}
                        onClick={() => {
                          setCurrentQuality(quality);
                          setShowQualityMenu(false);
                        }}
                        className={`block w-full px-4 py-1 text-sm text-left ${
                          currentQuality === quality ? 'text-purple-400' : 'text-white'
                        } hover:bg-white/10`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Share */}
              <button className="share-button text-white hover:text-gray-300">
                <Share2 className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="fullscreen-button text-white hover:text-gray-300"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Question Overlay */}
        {activeQuestion && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">{activeQuestion.question}</h3>
              <div className="space-y-3">
                {activeQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(index)}
                    disabled={showFeedback}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      showFeedback
                        ? index === activeQuestion.correct_answer
                          ? 'bg-green-100 border-green-500'
                          : index === selectedAnswer
                          ? 'bg-red-100 border-red-500'
                          : 'bg-gray-100'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showFeedback && (
                <p className="mt-4 text-center font-medium">
                  {selectedAnswer === activeQuestion.correct_answer
                    ? '¡Correcto! 🎉'
                    : 'Incorrecto. Inténtalo de nuevo.'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Information */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{videoData?.title}</h1>
        <p className="mt-2 text-gray-600">{videoData?.description}</p>
        
        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}