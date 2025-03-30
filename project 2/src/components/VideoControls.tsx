import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Subtitles, Share2 } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  onTimeUpdate: (value: number) => void;
  onFullscreen: () => void;
  onQualityChange: (quality: string) => void;
  onSubtitlesToggle: () => void;
  showSubtitles: boolean;
  currentQuality: string;
}

export function VideoControls({
  isPlaying,
  volume,
  isMuted,
  currentTime,
  duration,
  onPlayPause,
  onVolumeChange,
  onMuteToggle,
  onTimeUpdate,
  onFullscreen,
  onQualityChange,
  onSubtitlesToggle,
  showSubtitles,
  currentQuality
}: VideoControlsProps) {
  const [showQualityMenu, setShowQualityMenu] = React.useState(false);
  const qualities = ['1080p', '720p', '480p', '360p'];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      {/* Progress Bar */}
      <div className="progress-bar mb-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => onTimeUpdate(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Play/Pause */}
          <button onClick={onPlayPause} className="text-white hover:text-gray-300">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          {/* Volume */}
          <div className="flex items-center space-x-2">
            <button onClick={onMuteToggle} className="text-white hover:text-gray-300">
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>

          {/* Time */}
          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Subtitles */}
          <button
            onClick={onSubtitlesToggle}
            className={`text-white hover:text-gray-300 ${showSubtitles ? 'text-purple-400' : ''}`}
          >
            <Subtitles className="w-5 h-5" />
          </button>

          {/* Quality */}
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="text-white hover:text-gray-300"
            >
              <Settings className="w-5 h-5" />
            </button>
            {showQualityMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg py-2">
                {qualities.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => {
                      onQualityChange(quality);
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
          <button className="text-white hover:text-gray-300">
            <Share2 className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button onClick={onFullscreen} className="text-white hover:text-gray-300">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}