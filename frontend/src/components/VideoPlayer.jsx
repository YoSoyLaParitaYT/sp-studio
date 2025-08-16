import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const VideoPlayer = ({ movie, isOpen, onClose, showAds = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdCountdown, setShowAdCountdown] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (showAds && isOpen) {
      setShowAdCountdown(true);
      const countdown = setInterval(() => {
        setAdCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            setShowAdCountdown(false);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [showAds, isOpen]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Container */}
      <div 
        ref={playerRef}
        className="relative w-full h-full flex items-center justify-center"
        onMouseMove={handleMouseMove}
      >
        {/* YouTube Video Embed */}
        <div className="w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${movie.video_key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={movie.title}
          />
        </div>

        {/* Ad Overlay */}
        {showAdCountdown && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 text-center max-w-md">
              <div className="text-6xl mb-4">📺</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Anuncio publicitario</h3>
              <p className="text-gray-600 mb-4">
                Tu prueba gratuita ha expirado. Disfruta de este contenido después del anuncio.
              </p>
              <div className="text-2xl font-bold text-red-600">
                {adCountdown}s
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full w-12 h-12 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Video Title */}
        <div className={`absolute top-4 left-4 z-10 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <h2 className="text-white text-2xl font-bold drop-shadow-lg">
            {movie.title}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {movie.release_date?.split('-')[0]} • {movie.runtime ? `${movie.runtime} min` : 'Serie'}
          </p>
        </div>

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full"
              onValueChange={(value) => setCurrentTime(value[0])}
            />
            <div className="flex justify-between text-white text-sm mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 5400)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={togglePlay}
                size="icon"
                className="bg-white text-black hover:bg-white/80 rounded-full w-12 h-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleMute}
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <div className="w-20">
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={setVolume}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleFullscreen}
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;