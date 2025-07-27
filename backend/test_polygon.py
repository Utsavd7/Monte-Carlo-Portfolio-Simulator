# backend/test_polygon.py
import asyncio
import httpx
from datetime import datetime, timedelta

async def test_polygon_api():
    api_key = "pmZDLQ0QGmG383wti1jNpKyfpNzxkt7o"
    
    # Test 1: Basic API test
    print("Testing Polygon.io API...")
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    url = f"https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/{start_date.strftime('%Y-%m-%d')}/{end_date.strftime('%Y-%m-%d')}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params={"apiKey": api_key})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

if __name__ == "__main__":
    asyncio.run(test_polygon_api())