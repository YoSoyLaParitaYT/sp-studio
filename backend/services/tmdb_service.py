import aiohttp
import asyncio
from typing import List, Dict, Optional
import os
import random

class TMDBService:
    def __init__(self):
        # Rotate between API keys to avoid rate limits
        self.api_keys = [
            'c8dea14dc917687ac631a52620e4f7ad',
            '3cb41ecea3bf606c56552db3d17adefd'
        ]
        self.base_url = "https://api.themoviedb.org/3"
        self.image_base_url = "https://image.tmdb.org/t/p/"
        self.current_key_index = 0
    
    def get_api_key(self) -> str:
        """Get current API key and rotate for next request"""
        key = self.api_keys[self.current_key_index]
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        return key
    
    async def make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make request to TMDB API with error handling"""
        if params is None:
            params = {}
        
        params['api_key'] = self.get_api_key()
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(f"{self.base_url}{endpoint}", params=params) as response:
                    if response.status == 200:
                        return await response.json()
                    elif response.status == 429:  # Rate limit, try with different key
                        await asyncio.sleep(1)
                        params['api_key'] = self.get_api_key()
                        async with session.get(f"{self.base_url}{endpoint}", params=params) as retry_response:
                            if retry_response.status == 200:
                                return await retry_response.json()
                    return {"error": f"API request failed with status {response.status}"}
            except Exception as e:
                return {"error": str(e)}
    
    def process_movie_data(self, movie: Dict) -> Dict:
        """Process and standardize movie data"""
        return {
            "id": movie.get("id"),
            "title": movie.get("title", movie.get("name", "")),
            "overview": movie.get("overview", ""),
            "backdrop_path": f"{self.image_base_url}original{movie.get('backdrop_path')}" if movie.get('backdrop_path') else None,
            "poster_path": f"{self.image_base_url}w500{movie.get('poster_path')}" if movie.get('poster_path') else None,
            "release_date": movie.get("release_date", movie.get("first_air_date", "")),
            "vote_average": movie.get("vote_average", 0),
            "genre_ids": movie.get("genre_ids", []),
            "adult": movie.get("adult", False),
            "runtime": movie.get("runtime"),
            "video_key": None  # Will be populated when fetching videos
        }
    
    async def get_trending_movies(self, time_window: str = "day") -> List[Dict]:
        """Get trending movies"""
        data = await self.make_request(f"/trending/movie/{time_window}")
        if "results" in data:
            return [self.process_movie_data(movie) for movie in data["results"]]
        return []
    
    async def get_trending_tv(self, time_window: str = "day") -> List[Dict]:
        """Get trending TV shows"""
        data = await self.make_request(f"/trending/tv/{time_window}")
        if "results" in data:
            return [self.process_movie_data(movie) for movie in data["results"]]
        return []
    
    async def get_popular_movies(self, page: int = 1) -> List[Dict]:
        """Get popular movies"""
        data = await self.make_request("/movie/popular", {"page": page})
        if "results" in data:
            return [self.process_movie_data(movie) for movie in data["results"]]
        return []
    
    async def get_popular_tv(self, page: int = 1) -> List[Dict]:
        """Get popular TV shows"""
        data = await self.make_request("/tv/popular", {"page": page})
        if "results" in data:
            return [self.process_movie_data(movie) for movie in data["results"]]
        return []
    
    async def get_top_rated_movies(self, page: int = 1) -> List[Dict]:
        """Get top rated movies"""
        data = await self.make_request("/movie/top_rated", {"page": page})
        if "results" in data:
            return [self.process_movie_data(movie) for movie in data["results"]]
        return []
    
    async def get_movies_by_genre(self, genre_id: int, page: int = 1) -> List[Dict]:
        """Get movies by genre"""
        data = await self.make_request("/discover/movie", {
            "with_genres": genre_id,
            "page": page,
            "sort_by": "popularity.desc"
        })
        if "results" in data:
            return [self.process_movie_data(movie) for movie in data["results"]]
        return []
    
    async def get_tv_by_genre(self, genre_id: int, page: int = 1) -> List[Dict]:
        """Get TV shows by genre"""
        data = await self.make_request("/discover/tv", {
            "with_genres": genre_id,
            "page": page,
            "sort_by": "popularity.desc"
        })
        if "results" in data:
            return [self.process_movie_data(movie) for movie in data["results"]]
        return []
    
    async def search_movies(self, query: str, page: int = 1) -> List[Dict]:
        """Search movies and TV shows"""
        # Search both movies and TV shows
        movie_data = await self.make_request("/search/movie", {"query": query, "page": page})
        tv_data = await self.make_request("/search/tv", {"query": query, "page": page})
        
        results = []
        if "results" in movie_data:
            results.extend([self.process_movie_data(movie) for movie in movie_data["results"]])
        if "results" in tv_data:
            results.extend([self.process_movie_data(movie) for movie in tv_data["results"]])
        
        # Sort by popularity
        results.sort(key=lambda x: x.get("vote_average", 0), reverse=True)
        return results
    
    async def get_movie_details(self, movie_id: int) -> Optional[Dict]:
        """Get detailed movie information"""
        data = await self.make_request(f"/movie/{movie_id}")
        if "id" in data:
            movie = self.process_movie_data(data)
            
            # Get videos (trailers)
            videos = await self.get_movie_videos(movie_id)
            if videos:
                movie["video_key"] = videos[0].get("key")
            
            return movie
        return None
    
    async def get_tv_details(self, tv_id: int) -> Optional[Dict]:
        """Get detailed TV show information"""
        data = await self.make_request(f"/tv/{tv_id}")
        if "id" in data:
            movie = self.process_movie_data(data)
            
            # Get videos (trailers)
            videos = await self.get_tv_videos(tv_id)
            if videos:
                movie["video_key"] = videos[0].get("key")
            
            return movie
        return None
    
    async def get_movie_videos(self, movie_id: int) -> List[Dict]:
        """Get movie videos (trailers)"""
        data = await self.make_request(f"/movie/{movie_id}/videos")
        if "results" in data:
            # Filter for YouTube trailers
            trailers = [
                video for video in data["results"]
                if video.get("site") == "YouTube" and video.get("type") in ["Trailer", "Teaser"]
            ]
            return trailers
        return []
    
    async def get_tv_videos(self, tv_id: int) -> List[Dict]:
        """Get TV show videos (trailers)"""
        data = await self.make_request(f"/tv/{tv_id}/videos")
        if "results" in data:
            # Filter for YouTube trailers
            trailers = [
                video for video in data["results"]
                if video.get("site") == "YouTube" and video.get("type") in ["Trailer", "Teaser"]
            ]
            return trailers
        return []
    
    async def get_genres(self) -> Dict:
        """Get all available genres"""
        movie_genres = await self.make_request("/genre/movie/list")
        tv_genres = await self.make_request("/genre/tv/list")
        
        genres = {}
        if "genres" in movie_genres:
            for genre in movie_genres["genres"]:
                genres[genre["id"]] = genre["name"]
        if "genres" in tv_genres:
            for genre in tv_genres["genres"]:
                if genre["id"] not in genres:
                    genres[genre["id"]] = genre["name"]
        
        return genres
    
    async def get_netflix_style_content(self) -> Dict[str, List[Dict]]:
        """Get Netflix-style categorized content"""
        try:
            # Get various categories concurrently
            results = await asyncio.gather(
                self.get_trending_movies("day"),
                self.get_trending_tv("day"),
                self.get_popular_movies(1),
                self.get_popular_tv(1),
                self.get_top_rated_movies(1),
                self.get_movies_by_genre(28, 1),  # Action
                self.get_movies_by_genre(35, 1),  # Comedy  
                self.get_movies_by_genre(18, 1),  # Drama
                self.get_movies_by_genre(878, 1), # Sci-Fi
                self.get_movies_by_genre(27, 1),  # Horror
                return_exceptions=True
            )
            
            trending_movies, trending_tv, popular_movies, popular_tv, top_rated, action, comedy, drama, scifi, horror = results
            
            # Combine and organize content
            content = {
                "trending": (trending_movies or []) + (trending_tv or []),
                "popular_movies": popular_movies or [],
                "popular_series": popular_tv or [],
                "top_rated": top_rated or [],
                "action": action or [],
                "comedy": comedy or [],
                "drama": drama or [],
                "scifi": scifi or [],
                "horror": horror or []
            }
            
            # Remove duplicates and limit results
            for category, movies in content.items():
                seen_ids = set()
                unique_movies = []
                for movie in movies[:20]:  # Limit to 20 per category
                    if movie.get("id") not in seen_ids:
                        seen_ids.add(movie.get("id"))
                        unique_movies.append(movie)
                content[category] = unique_movies
            
            return content
            
        except Exception as e:
            print(f"Error getting Netflix content: {e}")
            return {}

# Global TMDB service instance
tmdb_service = TMDBService()