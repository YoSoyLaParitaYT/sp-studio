# PariFlix - API Contracts & Implementation Guide

## Overview
PariFlix is a Netflix clone with authentication, TMDB API integration for real movie data, and a 30-day free trial system with ads after expiration.

## Current Frontend Mock Data
The following data is currently mocked in `mockData.js` and needs to be replaced with real backend data:

### 1. Movies & TV Shows Data
- **Source**: TMDB API (keys provided: `c8dea14dc917687ac631a52620e4f7ad`, `3cb41ecea3bf606c56552db3d17adefd`)
- **Current Mock**: `mockMovies`, `mockMovieCategories`
- **Replace with**: Real TMDB API calls

### 2. User Authentication & Profiles  
- **Current Mock**: `mockUser` object with trial info
- **Replace with**: Real user system with Discord OAuth + regular auth

### 3. User Lists & Preferences
- **Current Mock**: `myList` array, `watchHistory` array
- **Replace with**: Database-stored user preferences

## API Contracts

### Authentication Endpoints

#### POST /api/auth/login
```json
{
  "email": "user@example.com", 
  "password": "password123"
}
```
**Response**: User object with JWT token

#### POST /api/auth/signup
```json
{
  "name": "Full Name",
  "email": "user@example.com",
  "password": "password123"  
}
```
**Response**: User object with 30-day trial activated

#### POST /api/auth/discord
Discord OAuth callback handling
**Response**: User object with JWT token

#### GET /api/auth/me
**Headers**: Authorization: Bearer {token}
**Response**: Current user profile with subscription status

### Movies & Content Endpoints

#### GET /api/movies/trending
**Response**: Array of trending movies from TMDB

#### GET /api/movies/popular
**Response**: Array of popular movies from TMDB  

#### GET /api/movies/categories/{category}
**Params**: category (action, comedy, drama, etc.)
**Response**: Array of movies in that category

#### GET /api/movies/{id}/details
**Response**: Detailed movie info including YouTube trailer key

#### GET /api/search?q={query}
**Response**: Search results from TMDB

### User Data Endpoints

#### GET /api/user/my-list
**Headers**: Authorization: Bearer {token}
**Response**: User's saved movies list

#### POST /api/user/my-list
```json
{
  "movieId": 123,
  "action": "add" | "remove"
}
```

#### POST /api/user/watch-progress
```json
{
  "movieId": 123,
  "progress": 85,
  "timestamp": "2024-01-20T10:30:00Z"
}
```

#### GET /api/user/watch-history
**Response**: User's watch history with progress

## Database Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string", 
  "password": "hashed_string",
  "avatar": "string",
  "provider": "local" | "discord",
  "providerId": "string",
  "subscription": {
    "type": "free_trial" | "free_with_ads" | "premium",
    "startDate": "date",
    "endDate": "date", 
    "daysRemaining": "number"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

### UserList Model  
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "movieId": "number",
  "movieData": "object", // Cached TMDB data
  "addedAt": "date"
}
```

### WatchHistory Model
```json
{
  "_id": "ObjectId", 
  "userId": "ObjectId",
  "movieId": "number",
  "progress": "number", // 0-100 percentage
  "watchedAt": "date",
  "completed": "boolean"
}
```

## TMDB Integration

### Required TMDB Endpoints
1. **Popular Movies**: `/movie/popular`
2. **Trending**: `/trending/movie/day` 
3. **Movie Details**: `/movie/{id}`
4. **Search**: `/search/movie`
5. **Genre List**: `/genre/movie/list`
6. **Movie Videos**: `/movie/{id}/videos` (for YouTube trailers)

### TMDB Configuration
- Base URL: `https://api.themoviedb.org/3`
- Image Base URL: `https://image.tmdb.org/t/p/`
- API Keys: Rotate between provided keys to avoid rate limits

## Frontend Integration Points

### 1. Replace Mock Data Imports
Remove `import { mockMovies, mockMovieCategories, mockUser } from '../mockData'` and replace with API calls.

### 2. Authentication Context
Create React Context for user state management across components.

### 3. API Service Layer
Create `src/services/api.js` for all backend communication.

### 4. Ad System Integration  
Show ads when `user.subscription.daysRemaining <= 0` in VideoPlayer component.

## Security Requirements

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcrypt for password storage  
3. **Discord OAuth**: Proper OAuth2 flow implementation
4. **Rate Limiting**: Protect TMDB API calls
5. **Input Validation**: Sanitize all user inputs
6. **CORS**: Proper CORS configuration

## Ad System Logic

### Free Trial (30 days)
- User gets full access without ads
- Display days remaining in header
- Warning notifications as trial expires

### Post-Trial (Free with Ads)  
- Show 5-second ad countdown before video playback
- Ad overlay implemented in VideoPlayer component
- Still allow full content access

## Implementation Priority

### Phase 1: Core Backend
1. User authentication (Discord + regular)
2. TMDB API integration  
3. Basic CRUD for user lists
4. JWT middleware

### Phase 2: Frontend Integration
1. Replace mock data with API calls
2. Implement authentication flow
3. Add loading states and error handling  
4. Connect user lists functionality

### Phase 3: Enhanced Features
1. Advanced search with filters
2. Recommendations based on watch history
3. User preferences and settings
4. Social features (if needed)

## Notes
- All movie data should be fetched fresh from TMDB to ensure current content
- Cache frequently accessed data (like user lists) in database
- Implement proper error boundaries in React components
- Use React Query or SWR for efficient data fetching and caching