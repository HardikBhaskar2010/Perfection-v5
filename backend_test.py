#!/usr/bin/env python3
"""
Backend API Testing Script
Tests the FastAPI backend endpoints for health check functionality.
"""

import requests
import json
import sys
from datetime import datetime
import os
from pathlib import Path

def load_backend_url():
    """Load the backend URL from frontend/.env file"""
    frontend_env_path = Path("/app/frontend/.env")
    
    if not frontend_env_path.exists():
        print("❌ ERROR: Frontend .env file not found")
        return None
    
    with open(frontend_env_path, 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                backend_url = line.split('=', 1)[1].strip()
                return f"{backend_url}/api"
    
    print("❌ ERROR: REACT_APP_BACKEND_URL not found in frontend/.env")
    return None

def test_get_root(base_url):
    """Test GET /api/ endpoint"""
    print("\n🔍 Testing GET /api/ endpoint...")
    
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            if data.get("message") == "Hello World":
                print("✅ GET /api/ test PASSED")
                return True
            else:
                print(f"❌ GET /api/ test FAILED: Expected message 'Hello World', got {data.get('message')}")
                return False
        else:
            print(f"❌ GET /api/ test FAILED: Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/ test FAILED: Request error - {e}")
        return False

def test_post_status(base_url):
    """Test POST /api/status endpoint"""
    print("\n🔍 Testing POST /api/status endpoint...")
    
    payload = {"client_name": "ui-tester"}
    
    try:
        response = requests.post(
            f"{base_url}/status", 
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate response structure
            required_fields = ["id", "client_name", "timestamp"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"❌ POST /api/status test FAILED: Missing fields {missing_fields}")
                return False, None
            
            if data["client_name"] != "ui-tester":
                print(f"❌ POST /api/status test FAILED: Expected client_name 'ui-tester', got {data['client_name']}")
                return False, None
            
            print("✅ POST /api/status test PASSED")
            return True, data
        else:
            print(f"❌ POST /api/status test FAILED: Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/status test FAILED: Request error - {e}")
        return False, None

def test_get_status(base_url, created_item=None):
    """Test GET /api/status endpoint"""
    print("\n🔍 Testing GET /api/status endpoint...")
    
    try:
        response = requests.get(f"{base_url}/status", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: Found {len(data)} status check(s)")
            
            if not isinstance(data, list):
                print(f"❌ GET /api/status test FAILED: Expected list, got {type(data)}")
                return False
            
            # If we have a created item, verify it's in the list
            if created_item:
                found_item = None
                for item in data:
                    if item.get("id") == created_item.get("id"):
                        found_item = item
                        break
                
                if found_item:
                    print(f"✅ Created item found in list: {found_item}")
                    print("✅ GET /api/status test PASSED")
                    return True
                else:
                    print(f"❌ GET /api/status test FAILED: Created item with id {created_item.get('id')} not found in list")
                    return False
            else:
                print("✅ GET /api/status test PASSED (no specific item to verify)")
                return True
        else:
            print(f"❌ GET /api/status test FAILED: Expected status 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/status test FAILED: Request error - {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Starting Backend API Health Check Tests")
    print("=" * 50)
    
    # Load backend URL
    base_url = load_backend_url()
    if not base_url:
        print("❌ CRITICAL: Cannot determine backend URL")
        sys.exit(1)
    
    print(f"🌐 Testing backend at: {base_url}")
    
    # Track test results
    test_results = []
    
    # Test 1: GET /api/
    result1 = test_get_root(base_url)
    test_results.append(("GET /api/", result1))
    
    # Test 2: POST /api/status
    result2, created_item = test_post_status(base_url)
    test_results.append(("POST /api/status", result2))
    
    # Test 3: GET /api/status
    result3 = test_get_status(base_url, created_item)
    test_results.append(("GET /api/status", result3))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 ALL TESTS PASSED!")
        return True
    else:
        print("💥 SOME TESTS FAILED!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)