#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class SuperGamerAPITester:
    def __init__(self, base_url="https://heroplay.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, params=data)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:100]}"
                
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        test_user_data = {
            "email": f"test_{datetime.now().strftime('%H%M%S')}@supergamer.com",
            "name": "Test User",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True, test_user_data
        return False, test_user_data

    def test_user_login(self, user_data):
        """Test user login"""
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            return True
        return False

    def test_get_current_user(self):
        """Test get current user endpoint"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_create_game_item(self):
        """Test creating a game item"""
        game_data = {
            "title": "Test Game",
            "description": "A test game for API testing",
            "image_url": "https://images.pexels.com/photos/7773751/pexels-photo-7773751.jpeg",
            "official_link": "https://example.com/testgame",
            "category": "games"
        }
        
        success, response = self.run_test(
            "Create Game Item",
            "POST",
            "items",
            200,
            data=game_data
        )
        
        if success:
            return True, response.get('id')
        return False, None

    def test_create_hero_item(self):
        """Test creating a hero item"""
        hero_data = {
            "title": "Test Hero",
            "description": "A test superhero for API testing",
            "image_url": "https://images.pexels.com/photos/15344060/pexels-photo-15344060.jpeg",
            "official_link": "https://example.com/testhero",
            "category": "heroes"
        }
        
        success, response = self.run_test(
            "Create Hero Item",
            "POST",
            "items",
            200,
            data=hero_data
        )
        
        if success:
            return True, response.get('id')
        return False, None

    def test_get_games(self):
        """Test getting games list"""
        success, response = self.run_test(
            "Get Games List",
            "GET",
            "items",
            200,
            data={"category": "games"}
        )
        return success

    def test_get_heroes(self):
        """Test getting heroes list"""
        success, response = self.run_test(
            "Get Heroes List",
            "GET",
            "items",
            200,
            data={"category": "heroes"}
        )
        return success

    def test_create_comment(self, item_id, category):
        """Test creating a comment"""
        comment_data = {
            "item_id": item_id,
            "category": category,
            "text": "This is a test comment for API testing"
        }
        
        success, response = self.run_test(
            f"Create Comment ({category})",
            "POST",
            "comments",
            200,
            data=comment_data
        )
        
        if success:
            return True, response.get('id')
        return False, None

    def test_get_comments(self, item_id, category):
        """Test getting comments for an item"""
        success, response = self.run_test(
            f"Get Comments ({category})",
            "GET",
            "comments",
            200,
            data={"item_id": item_id, "category": category}
        )
        return success

    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        success, _ = self.run_test(
            "Unauthorized Access Protection",
            "GET",
            "auth/me",
            401
        )
        
        # Restore token
        self.token = original_token
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Super Gamer API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)

        # Test registration and authentication
        reg_success, user_data = self.test_user_registration()
        if not reg_success:
            print("❌ Registration failed, stopping tests")
            return False

        # Test login
        if not self.test_user_login(user_data):
            print("❌ Login failed, stopping tests")
            return False

        # Test protected endpoints
        self.test_get_current_user()
        self.test_unauthorized_access()

        # Test item creation and retrieval
        game_success, game_id = self.test_create_game_item()
        hero_success, hero_id = self.test_create_hero_item()
        
        self.test_get_games()
        self.test_get_heroes()

        # Test comments if items were created successfully
        if game_success and game_id:
            comment_success, comment_id = self.test_create_comment(game_id, "games")
            if comment_success:
                self.test_get_comments(game_id, "games")

        if hero_success and hero_id:
            comment_success, comment_id = self.test_create_comment(hero_id, "heroes")
            if comment_success:
                self.test_get_comments(hero_id, "heroes")

        # Print summary
        print("=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print("🎉 Backend API tests mostly successful!")
            return True
        else:
            print("⚠️  Backend API has significant issues")
            return False

def main():
    tester = SuperGamerAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "tests_run": tester.tests_run,
                "tests_passed": tester.tests_passed,
                "success_rate": (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0,
                "timestamp": datetime.now().isoformat()
            },
            "detailed_results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())