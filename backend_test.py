#!/usr/bin/env python3
"""
PariFlix Backend API Test Suite
Tests all backend endpoints including authentication, user management, and TMDB integration
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Optional

# Get backend URL from environment
BACKEND_URL = "https://netflix-alt-3.preview.emergentagent.com/api"

class PariFlix_Backend_Tester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = None
        self.auth_token = None
        self.test_user_data = {
            "name": "Maria Rodriguez",
            "email": "maria.rodriguez@example.com", 
            "password": "SecurePass123!"
        }
        self.test_results = []
        
    async def setup_session(self):
        """Setup HTTP session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup_session(self):
        """Cleanup HTTP session"""
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple[int, Dict]:
        """Make HTTP request and return status code and response"""
        url = f"{self.base_url}{endpoint}"
        
        if headers is None:
            headers = {"Content-Type": "application/json"}
        
        if self.auth_token and "Authorization" not in headers:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            if method.upper() == "GET":
                async with self.session.get(url, headers=headers) as response:
                    return response.status, await response.json()
            elif method.upper() == "POST":
                async with self.session.post(url, json=data, headers=headers) as response:
                    return response.status, await response.json()
            elif method.upper() == "PUT":
                async with self.session.put(url, json=data, headers=headers) as response:
                    return response.status, await response.json()
            else:
                return 400, {"error": "Unsupported method"}
        except Exception as e:
            return 500, {"error": str(e)}
    
    async def test_health_check(self):
        """Test API health check endpoint"""
        status, response = await self.make_request("GET", "/")
        
        success = (
            status == 200 and 
            "message" in response and 
            "PariFlix API is running" in response["message"]
        )
        
        self.log_test(
            "Health Check", 
            success,
            f"Status: {status}, Response: {response}"
        )
        return success
    
    async def test_user_signup(self):
        """Test user registration endpoint"""
        status, response = await self.make_request("POST", "/auth/signup", self.test_user_data)
        
        success = (
            status == 200 and
            "user" in response and
            "access_token" in response and
            response["user"]["email"] == self.test_user_data["email"] and
            response["user"]["name"] == self.test_user_data["name"]
        )
        
        if success:
            self.auth_token = response["access_token"]
            # Verify 30-day trial (allow for 29-30 days due to timing)
            subscription = response["user"]["subscription"]
            trial_success = (
                subscription["type"] == "free_trial" and
                subscription["days_remaining"] >= 29
            )
            if not trial_success:
                success = False
                self.log_test("User Signup - Trial Setup", False, f"Trial not properly configured: {subscription}")
            else:
                self.log_test("User Signup - Trial Setup", True, f"Trial properly configured: {subscription['days_remaining']} days remaining")
        
        self.log_test(
            "User Signup", 
            success,
            f"Status: {status}, Token received: {bool(self.auth_token)}"
        )
        return success
    
    async def test_user_login(self):
        """Test user login endpoint"""
        login_data = {
            "email": self.test_user_data["email"],
            "password": self.test_user_data["password"]
        }
        
        status, response = await self.make_request("POST", "/auth/login", login_data)
        
        success = (
            status == 200 and
            "user" in response and
            "access_token" in response and
            response["user"]["email"] == self.test_user_data["email"]
        )
        
        if success:
            self.auth_token = response["access_token"]
        
        self.log_test(
            "User Login", 
            success,
            f"Status: {status}, Token received: {bool(self.auth_token)}"
        )
        return success
    
    async def test_get_current_user(self):
        """Test get current user info endpoint"""
        if not self.auth_token:
            self.log_test("Get Current User", False, "No auth token available")
            return False
        
        status, response = await self.make_request("GET", "/auth/me")
        
        success = (
            status == 200 and
            "id" in response and
            "email" in response and
            response["email"] == self.test_user_data["email"]
        )
        
        self.log_test(
            "Get Current User", 
            success,
            f"Status: {status}, User ID: {response.get('id', 'N/A')}"
        )
        return success
    
    async def test_update_profile(self):
        """Test update user profile endpoint"""
        if not self.auth_token:
            self.log_test("Update Profile", False, "No auth token available")
            return False
        
        update_data = {
            "name": "Maria Rodriguez Updated",
            "language": "en",
            "country": "US"
        }
        
        status, response = await self.make_request("PUT", "/user/profile", update_data)
        
        success = (
            status == 200 and
            "name" in response and
            response["name"] == update_data["name"] and
            response["profile"]["language"] == update_data["language"]
        )
        
        self.log_test(
            "Update Profile", 
            success,
            f"Status: {status}, Name updated: {response.get('name', 'N/A')}"
        )
        return success
    
    async def test_my_list_functionality(self):
        """Test My List add/remove functionality"""
        if not self.auth_token:
            self.log_test("My List Functionality", False, "No auth token available")
            return False
        
        # Test movie ID (popular movie)
        test_movie_id = 550  # Fight Club
        
        # Test adding to My List
        add_data = {"movie_id": test_movie_id, "action": "add"}
        status, response = await self.make_request("POST", "/user/my-list", add_data)
        
        add_success = (
            status == 200 and
            response.get("success") is True and
            "Added to My List" in response.get("message", "")
        )
        
        if not add_success:
            self.log_test("My List - Add Movie", False, f"Status: {status}, Response: {response}")
            return False
        
        # Test getting My List
        status, response = await self.make_request("GET", "/user/my-list")
        
        get_success = (
            status == 200 and
            "movies" in response and
            len(response["movies"]) > 0
        )
        
        if not get_success:
            self.log_test("My List - Get Movies", False, f"Status: {status}, Response: {response}")
            return False
        
        # Test removing from My List
        remove_data = {"movie_id": test_movie_id, "action": "remove"}
        status, response = await self.make_request("POST", "/user/my-list", remove_data)
        
        remove_success = (
            status == 200 and
            response.get("success") is True and
            "Removed from My List" in response.get("message", "")
        )
        
        self.log_test(
            "My List Functionality", 
            add_success and get_success and remove_success,
            f"Add: {add_success}, Get: {get_success}, Remove: {remove_success}"
        )
        return add_success and get_success and remove_success
    
    async def test_watch_history(self):
        """Test watch history functionality"""
        if not self.auth_token:
            self.log_test("Watch History", False, "No auth token available")
            return False
        
        # Test adding to watch history
        watch_data = {
            "movie_id": 550,  # Fight Club
            "progress": 45,
            "completed": False
        }
        
        status, response = await self.make_request("POST", "/user/watch-history", watch_data)
        
        add_success = (
            status == 200 and
            response.get("success") is True
        )
        
        if not add_success:
            self.log_test("Watch History - Add", False, f"Status: {status}, Response: {response}")
            return False
        
        # Test getting watch history
        status, response = await self.make_request("GET", "/user/watch-history")
        
        get_success = (
            status == 200 and
            "history" in response
        )
        
        self.log_test(
            "Watch History", 
            add_success and get_success,
            f"Add: {add_success}, Get: {get_success}"
        )
        return add_success and get_success
    
    async def test_tmdb_integration(self):
        """Test TMDB API integration endpoints"""
        
        # Test Netflix content endpoint
        status, response = await self.make_request("GET", "/content/netflix")
        netflix_success = (
            status == 200 and
            isinstance(response, dict) and
            len(response) > 0
        )
        
        # Test trending content
        status, response = await self.make_request("GET", "/content/trending")
        trending_success = (
            status == 200 and
            "trending_movies" in response and
            "trending_tv" in response
        )
        
        # Test search functionality
        status, response = await self.make_request("GET", "/content/search?q=superman")
        search_success = (
            status == 200 and
            "results" in response and
            len(response["results"]) > 0
        )
        
        # Test movie details
        status, response = await self.make_request("GET", "/content/movie/550")  # Fight Club
        movie_details_success = (
            status == 200 and
            "id" in response and
            "title" in response
        )
        
        overall_success = netflix_success and trending_success and search_success and movie_details_success
        
        self.log_test(
            "TMDB Integration", 
            overall_success,
            f"Netflix: {netflix_success}, Trending: {trending_success}, Search: {search_success}, Details: {movie_details_success}"
        )
        return overall_success
    
    async def test_authentication_protection(self):
        """Test that protected endpoints require authentication"""
        # Temporarily remove auth token
        original_token = self.auth_token
        self.auth_token = None
        
        # Test protected endpoints without token
        protected_endpoints = [
            ("GET", "/auth/me"),
            ("PUT", "/user/profile"),
            ("GET", "/user/my-list"),
            ("POST", "/user/my-list"),
            ("GET", "/user/watch-history"),
            ("POST", "/user/watch-history")
        ]
        
        all_protected = True
        for method, endpoint in protected_endpoints:
            status, response = await self.make_request(method, endpoint, {})
            # Accept both 401 (Unauthorized) and 403 (Forbidden) as valid auth protection
            if status not in [401, 403]:
                all_protected = False
                self.log_test(f"Auth Protection - {endpoint}", False, f"Expected 401/403, got {status}")
            else:
                self.log_test(f"Auth Protection - {endpoint}", True, f"Properly protected with status {status}")
        
        # Restore auth token
        self.auth_token = original_token
        
        self.log_test(
            "Authentication Protection", 
            all_protected,
            f"All protected endpoints require authentication: {all_protected}"
        )
        return all_protected
    
    async def test_invalid_credentials(self):
        """Test login with invalid credentials"""
        invalid_login = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        status, response = await self.make_request("POST", "/auth/login", invalid_login)
        
        success = (
            status == 401 and
            "detail" in response
        )
        
        self.log_test(
            "Invalid Credentials", 
            success,
            f"Status: {status}, Properly rejected invalid login"
        )
        return success
    
    async def test_duplicate_signup(self):
        """Test signup with existing email"""
        # Try to signup with same email again
        status, response = await self.make_request("POST", "/auth/signup", self.test_user_data)
        
        success = (
            status == 400 and
            "detail" in response and
            "already registered" in response["detail"]
        )
        
        self.log_test(
            "Duplicate Signup Prevention", 
            success,
            f"Status: {status}, Properly prevented duplicate signup"
        )
        return success
    
    def print_summary(self):
        """Print test summary"""
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"\n{'='*60}")
        print(f"PARIFLIX BACKEND TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"❌ {result['test']}: {result['details']}")
        
        return passed_tests, failed_tests
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("Starting PariFlix Backend API Tests...")
        print(f"Testing against: {self.base_url}")
        print("="*60)
        
        await self.setup_session()
        
        try:
            # Core functionality tests
            await self.test_health_check()
            await self.test_user_signup()
            await self.test_user_login()
            await self.test_get_current_user()
            await self.test_update_profile()
            await self.test_my_list_functionality()
            await self.test_watch_history()
            await self.test_tmdb_integration()
            
            # Security tests
            await self.test_authentication_protection()
            await self.test_invalid_credentials()
            await self.test_duplicate_signup()
            
        finally:
            await self.cleanup_session()
        
        return self.print_summary()

async def main():
    """Main test runner"""
    tester = PariFlix_Backend_Tester()
    passed, failed = await tester.run_all_tests()
    
    # Exit with appropriate code
    exit_code = 0 if failed == 0 else 1
    return exit_code

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)