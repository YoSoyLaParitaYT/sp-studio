from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

class SubscriptionInfo(BaseModel):
    type: str = "free_trial"  # free_trial, free_with_ads, premium
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: Optional[datetime] = None
    days_remaining: int = 30

class UserProfile(BaseModel):
    name: str
    email: EmailStr
    avatar: Optional[str] = None
    language: str = "es"
    country: str = "ES"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    password_hash: str
    avatar: Optional[str] = "https://i.pravatar.cc/150?img=3"
    subscription: SubscriptionInfo = Field(default_factory=SubscriptionInfo)
    my_list: List[int] = Field(default_factory=list)
    watch_history: List[dict] = Field(default_factory=list)
    profile: UserProfile
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    avatar: Optional[str]
    subscription: SubscriptionInfo
    my_list: List[int]
    watch_history: List[dict]
    profile: UserProfile
    created_at: datetime

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    language: Optional[str] = None
    country: Optional[str] = None

class WatchHistoryItem(BaseModel):
    movie_id: int
    progress: int  # 0-100 percentage
    watched_at: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = False

class MyListItem(BaseModel):
    movie_id: int
    action: str  # "add" or "remove"