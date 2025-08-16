from typing import Optional, List
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user import User, UserCreate, UserLogin, UserResponse, UserProfile, SubscriptionInfo, WatchHistoryItem, MyListItem
from services.auth_service import get_password_hash, verify_password, create_access_token, calculate_days_remaining
import uuid

class UserService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.users_collection = db.users
        
    async def create_user(self, user_data: UserCreate) -> Optional[UserResponse]:
        """Create a new user account"""
        try:
            # Check if user already exists
            existing_user = await self.users_collection.find_one({"email": user_data.email})
            if existing_user:
                return None
                
            # Create user with 30-day trial
            user_id = str(uuid.uuid4())
            now = datetime.utcnow()
            end_date = now + timedelta(days=30)
            
            user = User(
                id=user_id,
                name=user_data.name,
                email=user_data.email,
                password_hash=get_password_hash(user_data.password),
                subscription=SubscriptionInfo(
                    type="free_trial",
                    start_date=now,
                    end_date=end_date,
                    days_remaining=30
                ),
                profile=UserProfile(
                    name=user_data.name,
                    email=user_data.email
                )
            )
            
            # Insert into database
            await self.users_collection.insert_one(user.dict())
            
            return UserResponse(**user.dict())
            
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    async def authenticate_user(self, credentials: UserLogin) -> Optional[tuple[UserResponse, str]]:
        """Authenticate user and return user data with JWT token"""
        try:
            # Find user by email
            user_data = await self.users_collection.find_one({"email": credentials.email})
            if not user_data:
                return None
                
            # Verify password
            if not verify_password(credentials.password, user_data["password_hash"]):
                return None
                
            # Update days remaining
            user_data["subscription"]["days_remaining"] = calculate_days_remaining(
                user_data["subscription"]["start_date"]
            )
            
            # Update subscription type if trial expired
            if user_data["subscription"]["days_remaining"] <= 0:
                user_data["subscription"]["type"] = "free_with_ads"
            
            # Update user in database
            await self.users_collection.update_one(
                {"id": user_data["id"]},
                {"$set": {"subscription": user_data["subscription"], "updated_at": datetime.utcnow()}}
            )
            
            # Create JWT token
            token = create_access_token(data={"sub": user_data["email"], "user_id": user_data["id"]})
            
            # Remove password hash from response
            user_data.pop("password_hash", None)
            user_response = UserResponse(**user_data)
            
            return user_response, token
            
        except Exception as e:
            print(f"Error authenticating user: {e}")
            return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """Get user by ID"""
        try:
            user_data = await self.users_collection.find_one({"id": user_id})
            if not user_data:
                return None
                
            # Update days remaining
            user_data["subscription"]["days_remaining"] = calculate_days_remaining(
                user_data["subscription"]["start_date"]
            )
            
            # Update subscription type if trial expired
            if user_data["subscription"]["days_remaining"] <= 0:
                user_data["subscription"]["type"] = "free_with_ads"
            
            # Update user in database
            await self.users_collection.update_one(
                {"id": user_id},
                {"$set": {"subscription": user_data["subscription"], "updated_at": datetime.utcnow()}}
            )
            
            # Remove password hash from response
            user_data.pop("password_hash", None)
            return UserResponse(**user_data)
            
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """Get user by email"""
        try:
            user_data = await self.users_collection.find_one({"email": email})
            if not user_data:
                return None
                
            # Remove password hash from response
            user_data.pop("password_hash", None)
            return UserResponse(**user_data)
            
        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None
    
    async def update_user_profile(self, user_id: str, updates: dict) -> Optional[UserResponse]:
        """Update user profile"""
        try:
            # Prepare update data
            update_data = {"updated_at": datetime.utcnow()}
            
            # Update profile fields
            if "name" in updates:
                update_data["name"] = updates["name"]
                update_data["profile.name"] = updates["name"]
            if "avatar" in updates:
                update_data["avatar"] = updates["avatar"]
            if "language" in updates:
                update_data["profile.language"] = updates["language"]
            if "country" in updates:
                update_data["profile.country"] = updates["country"]
            
            # Update in database
            result = await self.users_collection.update_one(
                {"id": user_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_user_by_id(user_id)
            return None
            
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return None
    
    async def add_to_my_list(self, user_id: str, movie_id: int) -> bool:
        """Add movie to user's list"""
        try:
            result = await self.users_collection.update_one(
                {"id": user_id},
                {"$addToSet": {"my_list": movie_id}, "$set": {"updated_at": datetime.utcnow()}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error adding to my list: {e}")
            return False
    
    async def remove_from_my_list(self, user_id: str, movie_id: int) -> bool:
        """Remove movie from user's list"""
        try:
            result = await self.users_collection.update_one(
                {"id": user_id},
                {"$pull": {"my_list": movie_id}, "$set": {"updated_at": datetime.utcnow()}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error removing from my list: {e}")
            return False
    
    async def update_watch_history(self, user_id: str, watch_item: WatchHistoryItem) -> bool:
        """Update user's watch history"""
        try:
            # Remove existing entry for this movie
            await self.users_collection.update_one(
                {"id": user_id},
                {"$pull": {"watch_history": {"movie_id": watch_item.movie_id}}}
            )
            
            # Add new entry
            result = await self.users_collection.update_one(
                {"id": user_id},
                {
                    "$push": {"watch_history": watch_item.dict()},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating watch history: {e}")
            return False
    
    async def get_watch_history(self, user_id: str) -> List[dict]:
        """Get user's watch history"""
        try:
            user_data = await self.users_collection.find_one({"id": user_id})
            if user_data:
                return user_data.get("watch_history", [])
            return []
        except Exception as e:
            print(f"Error getting watch history: {e}")
            return []