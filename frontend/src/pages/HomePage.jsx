import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import VideoPlayer from '../components/VideoPlayer';
import ProfileModal from '../components/ProfileModal';
import apiService from '../services/api';

const HomePage = ({ user, onSignOut, onUpdateProfile }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userList, setUserList] = useState(user?.my_list || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState({});
  const [myListMovies, setMyListMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all content when component mounts
    loadContent();
    loadMyList();
  }, []);

  const loadContent = async () => {
    try {
      const netflixContent = await apiService.getNetflixContent();
      setContent(netflixContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyList = async () => {
    try {
      const myListData = await apiService.getMyList();
      setMyListMovies(myListData.movies || []);
      setUserList(myListData.movies?.map(movie => movie.id) || []);
    } catch (error) {
      console.error('Error loading my list:', error);
    }
  };

  const handlePlay = async (movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
    
    // Update watch history
    try {
      await apiService.updateWatchHistory(movie.id, 0);
    } catch (error) {
      console.error('Error updating watch history:', error);
    }
  };

  const handleMoreInfo = (movie) => {
    console.log('Show more info for:', movie.title);
    // TODO: Open movie detail modal
  };

  const handleAddToList = async (movie) => {
    try {
      if (userList.includes(movie.id)) {
        await apiService.removeFromMyList(movie.id);
        setUserList(userList.filter(id => id !== movie.id));
        setMyListMovies(myListMovies.filter(m => m.id !== movie.id));
      } else {
        await apiService.addToMyList(movie.id);
        setUserList([...userList, movie.id]);
        setMyListMovies([...myListMovies, movie]);
      }
    } catch (error) {
      console.error('Error managing my list:', error);
      alert('Error al actualizar Mi Lista');
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const searchResults = await apiService.searchContent(query);
      console.log('Search results:', searchResults);
      // TODO: Show search results
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    onUpdateProfile(updatedUser);
    setIsProfileOpen(false);
  };

  // Featured content (first from trending or popular)
  const featuredContent = content.trending?.[0] || content.popular_movies?.[0] || {};

  // Show ads if user's trial has expired
  const showAds = user?.subscription?.days_remaining <= 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-red-600 text-4xl font-bold mb-4">PARIFLIX</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-white mt-4">Cargando películas...</p>
        </div>
      </div>
    );
  }

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
          {content.trending?.length > 0 && (
            <MovieRow
              title="Tendencias actuales"
              movies={content.trending}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.popular_series?.length > 0 && (
            <MovieRow
              title="Series populares"
              movies={content.popular_series}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.popular_movies?.length > 0 && (
            <MovieRow
              title="Películas populares"
              movies={content.popular_movies}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.action?.length > 0 && (
            <MovieRow
              title="Acción y aventura"
              movies={content.action}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.comedy?.length > 0 && (
            <MovieRow
              title="Comedias"
              movies={content.comedy}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.drama?.length > 0 && (
            <MovieRow
              title="Dramas"
              movies={content.drama}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.scifi?.length > 0 && (
            <MovieRow
              title="Ciencia ficción"
              movies={content.scifi}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.horror?.length > 0 && (
            <MovieRow
              title="Terror"
              movies={content.horror}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {content.top_rated?.length > 0 && (
            <MovieRow
              title="Mejor valoradas"
              movies={content.top_rated}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}

          {myListMovies.length > 0 && (
            <MovieRow
              title="Mi lista"
              movies={myListMovies}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
              onMoreInfo={handleMoreInfo}
              userList={userList}
            />
          )}
        </div>
      </main>

      {/* Video Player */}
      <VideoPlayer
        movie={selectedMovie}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        showAds={showAds}
      />

      {/* Profile Modal */}
      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdateProfile={handleProfileUpdate}
      />
    </div>
  );
};

export default HomePage;