import React, { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import VideoPlayer from '../components/VideoPlayer';
import { mockMovies, mockMovieCategories, mockUser } from '../mockData';

const HomePage = ({ user = mockUser, onSignOut }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [userList, setUserList] = useState(mockUser.myList);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlay = (movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
  };

  const handleMoreInfo = (movie) => {
    console.log('Show more info for:', movie.title);
    // TODO: Open movie detail modal
  };

  const handleAddToList = (movie) => {
    if (userList.includes(movie.id)) {
      setUserList(userList.filter(id => id !== movie.id));
    } else {
      setUserList([...userList, movie.id]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // TODO: Open profile modal
  };

  // Featured content (first movie from trending)
  const featuredContent = mockMovieCategories.trending[0] || mockMovies[0];

  // Show ads if user's trial has expired
  const showAds = user?.subscription?.daysRemaining <= 0;

  return (
    <div className="min-h-screen bg-black">
      <Header
        user={user}
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
        onSignOut={onSignOut}
      />

      <main>
        {/* Hero Section */}
        <HeroSection
          featuredContent={featuredContent}
          onPlay={handlePlay}
          onMoreInfo={handleMoreInfo}
        />

        {/* Movie Rows */}
        <div className="relative z-10 -mt-32 pb-20">
          <MovieRow
            title="Tendencias actuales"
            movies={mockMovieCategories.trending}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onMoreInfo={handleMoreInfo}
            userList={userList}
          />

          <MovieRow
            title="Series populares"
            movies={mockMovies}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onMoreInfo={handleMoreInfo}
            userList={userList}
          />

          <MovieRow
            title="Acción y aventura"
            movies={mockMovieCategories.action}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onMoreInfo={handleMoreInfo}
            userList={userList}
          />

          <MovieRow
            title="Comedias"
            movies={mockMovieCategories.comedy}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onMoreInfo={handleMoreInfo}
            userList={userList}
          />

          <MovieRow
            title="Mi lista"
            movies={mockMovies.filter(movie => userList.includes(movie.id))}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onMoreInfo={handleMoreInfo}
            userList={userList}
          />
        </div>
      </main>

      {/* Video Player */}
      <VideoPlayer
        movie={selectedMovie}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        showAds={showAds}
      />
    </div>
  );
};

export default HomePage;