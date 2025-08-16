import React, { useState } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const HeroSection = ({ featuredContent, onPlay, onMoreInfo }) => {
  const [isMuted, setIsMuted] = useState(true);

  if (!featuredContent) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image/Video */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${featuredContent.backdrop_path})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="px-4 md:px-8 lg:px-16 max-w-2xl">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            {featuredContent.title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-lg max-w-xl">
            {featuredContent.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={() => onPlay(featuredContent)}
              className="bg-white text-black hover:bg-white/80 text-lg px-8 py-3 h-auto font-semibold flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <Play className="h-6 w-6 fill-current" />
              Reproducir
            </Button>
            
            <Button
              onClick={() => onMoreInfo(featuredContent)}
              variant="secondary"
              className="bg-gray-500/70 text-white hover:bg-gray-500/90 text-lg px-8 py-3 h-auto font-semibold flex items-center gap-2 backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
            >
              <Info className="h-6 w-6" />
              Más información
            </Button>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {featuredContent.genres?.map((genre, index) => (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
              >
                {genre}
              </span>
            )) || (
              <>
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">Drama</span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">Ciencia ficción</span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">Misterio</span>
              </>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="bg-red-600 px-2 py-1 rounded text-xs font-bold">NUEVO</span>
            <span>{featuredContent.release_date?.split('-')[0] || '2024'}</span>
            <span className="border border-white/50 px-2 py-1 rounded text-xs">HD</span>
            {featuredContent.runtime && <span>{featuredContent.runtime} min</span>}
          </div>
        </div>

        {/* Audio Control */}
        <div className="absolute bottom-24 right-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 hover:bg-black/70 text-white border border-white/20 rounded-full w-12 h-12"
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;