from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging

# Import models and services
from models.user import (
    UserCreate, UserLogin, UserResponse, UserProfileUpdate, 
    WatchHistoryItem, MyListItem
)
from services.auth_service import verify_token
from services.user_service import UserService
from services.tmdb_service import tmdb_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
user_service = UserService(db)

# Security
security = HTTPBearer()

# Create the main app
app = FastAPI(title="PariFlix API", version="1.0.0")

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = await user_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "PariFlix API is running", "version": "1.0.0"}

# Authentication endpoints
@api_router.post("/auth/signup", response_model=dict)
async def signup(user_data: UserCreate):
    """Create a new user account"""
    user = await user_service.create_user(user_data)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered or invalid data"
        )
    
    # Generate token for immediate login
    user_response, token = await user_service.authenticate_user(
        UserLogin(email=user_data.email, password=user_data.password)
    )
    
    return {
        "user": user_response,
        "access_token": token,
        "token_type": "bearer",
        "message": "Account created successfully"
    }

@api_router.post("/auth/login", response_model=dict)
async def login(credentials: UserLogin):
    """Authenticate user and return access token"""
    result = await user_service.authenticate_user(credentials)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user, token = result
    return {
        "user": user,
        "access_token": token,
        "token_type": "bearer",
        "message": "Login successful"
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

# User profile endpoints
@api_router.put("/user/profile", response_model=UserResponse)
async def update_profile(
    updates: UserProfileUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update user profile"""
    updated_user = await user_service.update_user_profile(
        current_user.id, 
        updates.dict(exclude_unset=True)
    )
    
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update profile"
        )
    
    return updated_user

# My List endpoints
@api_router.post("/user/my-list")
async def manage_my_list(
    item: MyListItem,
    current_user: UserResponse = Depends(get_current_user)
):
    """Add or remove movie from user's list"""
    if item.action == "add":
        success = await user_service.add_to_my_list(current_user.id, item.movie_id)
        message = "Added to My List" if success else "Failed to add to My List"
    elif item.action == "remove":
        success = await user_service.remove_from_my_list(current_user.id, item.movie_id)  
        message = "Removed from My List" if success else "Failed to remove from My List"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action must be 'add' or 'remove'"
        )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    return {"success": True, "message": message}

@api_router.get("/user/my-list")
async def get_my_list(current_user: UserResponse = Depends(get_current_user)):
    """Get user's My List with movie details"""
    movie_ids = current_user.my_list
    movies = []
    
    # Get movie details from TMDB for each ID
    for movie_id in movie_ids:
        try:
            movie_details = await tmdb_service.get_movie_details(movie_id)
            if movie_details:
                movies.append(movie_details)
            else:
                # Try TV show if movie not found
                tv_details = await tmdb_service.get_tv_details(movie_id)
                if tv_details:
                    movies.append(tv_details)
        except Exception as e:
            print(f"Error fetching movie {movie_id}: {e}")
            continue
    
    return {"movies": movies}

# Watch history endpoints
@api_router.post("/user/watch-history")
async def update_watch_history(
    watch_item: WatchHistoryItem,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update user's watch history"""
    success = await user_service.update_watch_history(current_user.id, watch_item)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update watch history"
        )
    
    return {"success": True, "message": "Watch history updated"}

@api_router.get("/user/watch-history")
async def get_watch_history(current_user: UserResponse = Depends(get_current_user)):
    """Get user's watch history with movie details"""
    history = await user_service.get_watch_history(current_user.id)
    
    # Get movie details for each item in history
    detailed_history = []
    for item in history:
        try:
            movie_details = await tmdb_service.get_movie_details(item["movie_id"])
            if movie_details:
                detailed_history.append({
                    **item,
                    "movie_details": movie_details
                })
            else:
                # Try TV show if movie not found
                tv_details = await tmdb_service.get_tv_details(item["movie_id"])
                if tv_details:
                    detailed_history.append({
                        **item,
                        "movie_details": tv_details
                    })
        except Exception as e:
            print(f"Error fetching movie details for history: {e}")
            detailed_history.append(item)
    
    return {"history": detailed_history}

# Content endpoints
@api_router.get("/content/netflix")
async def get_netflix_content():
    """Get Netflix-style categorized content"""
    content = await tmdb_service.get_netflix_style_content()
    return content

@api_router.get("/content/trending")
async def get_trending():
    """Get trending movies and TV shows"""
    movies = await tmdb_service.get_trending_movies()
    tv_shows = await tmdb_service.get_trending_tv()
    return {
        "trending_movies": movies,
        "trending_tv": tv_shows,
        "combined": movies + tv_shows
    }

@api_router.get("/content/popular")
async def get_popular():
    """Get popular movies and TV shows"""
    movies = await tmdb_service.get_popular_movies()
    tv_shows = await tmdb_service.get_popular_tv()
    return {
        "popular_movies": movies,
        "popular_tv": tv_shows
    }

@api_router.get("/content/search")
async def search_content(q: str, page: int = 1):
    """Search movies and TV shows"""
    if not q.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty"
        )
    
    results = await tmdb_service.search_movies(q, page)
    return {"results": results, "query": q, "page": page}

@api_router.get("/content/genres")
async def get_genres():
    """Get all available genres"""
    genres = await tmdb_service.get_genres()
    return {"genres": genres}

@api_router.get("/content/genre/{genre_id}")
async def get_content_by_genre(genre_id: int, page: int = 1):
    """Get content by genre"""
    movies = await tmdb_service.get_movies_by_genre(genre_id, page)
    tv_shows = await tmdb_service.get_tv_by_genre(genre_id, page)
    return {
        "movies": movies,
        "tv_shows": tv_shows,
        "combined": movies + tv_shows
    }

@api_router.get("/content/movie/{movie_id}")
async def get_movie_details(movie_id: int):
    """Get detailed movie information"""
    movie = await tmdb_service.get_movie_details(movie_id)
    if movie is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    return movie

@api_router.get("/content/tv/{tv_id}")
async def get_tv_details(tv_id: int):
    """Get detailed TV show information"""
    tv_show = await tmdb_service.get_tv_details(tv_id)
    if tv_show is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TV show not found"
        )
    return tv_show

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)