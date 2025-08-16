import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp, ChevronDown, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const MovieCard = ({ movie, onPlay, onAddToList, onMoreInfo, isInList }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 w-64 md:w-72 transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="bg-transparent border-none overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Hover Overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  onClick={() => onPlay(movie)}
                  size="icon"
                  className="bg-white text-black hover:bg-white/80 rounded-full w-12 h-12 transform hover:scale-110 transition-all duration-200"
                >
                  <Play className="h-6 w-6 fill-current" />
                </Button>
              </div>
            )}
          </div>

          {/* Movie Info Popup - Appears on hover */}
          {isHovered && (
            <div className="absolute top-full left-0 right-0 z-50 bg-gray-900 rounded-b-lg shadow-2xl p-4 transform transition-all duration-300 group-hover:translate-y-0">
              <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                {movie.title}
              </h3>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-3">
                <Button
                  onClick={() => onPlay(movie)}
                  size="icon"
                  className="bg-white text-black hover:bg-white/80 rounded-full w-8 h-8"
                >
                  <Play className="h-4 w-4 fill-current" />
                </Button>
                
                <Button
                  onClick={() => onAddToList(movie)}
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/10 rounded-full w-8 h-8 border border-white/30"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/10 rounded-full w-8 h-8 border border-white/30"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => onMoreInfo(movie)}
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/10 rounded-full w-8 h-8 border border-white/30 ml-auto"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Movie Details */}
              <div className="text-white/80 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 px-2 py-0.5 rounded text-xs font-bold">
                    {Math.round(movie.vote_average * 10)}% coincidencia
                  </span>
                  <span className="border border-white/30 px-1.5 py-0.5 rounded text-xs">HD</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <span>{movie.release_date?.split('-')[0] || '2024'}</span>
                  {movie.runtime && <span>{movie.runtime} min</span>}
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                
                <p className="text-xs line-clamp-2 leading-relaxed mt-2">
                  {movie.overview}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MovieRow = ({ title, movies, onPlay, onAddToList, onMoreInfo, userList = [] }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Update button states
      setTimeout(() => {
        if (scrollRef.current) {
          setCanScrollLeft(scrollRef.current.scrollLeft > 0);
          setCanScrollRight(
            scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
          );
        }
      }, 300);
    }
  };

  return (
    <div className="mb-8 group">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4 px-4 md:px-8">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <Button
            onClick={() => scroll('left')}
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {/* Right Arrow */}
        {canScrollRight && (
          <Button
            onClick={() => scroll('right')}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
        
        {/* Movies Container */}
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onAddToList={onAddToList}
              onMoreInfo={onMoreInfo}
              isInList={userList.includes(movie.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;