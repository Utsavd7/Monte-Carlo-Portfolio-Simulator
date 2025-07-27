# backend/services/data_fetcher.py
import httpx
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List
import numpy as np
import asyncio

class DataFetcher:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.polygon.io"
        print(f"DataFetcher initialized with API key: {api_key[:10]}...")  # Debug
        
    async def get_stock_data(self, ticker: str, days: int = 365) -> pd.DataFrame:
        """Fetch historical stock data from Polygon.io"""
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Format dates
        start_str = start_date.strftime('%Y-%m-%d')
        end_str = end_date.strftime('%Y-%m-%d')
        
        # Build URL exactly like the test
        url = f"{self.base_url}/v2/aggs/ticker/{ticker}/range/1/day/{start_str}/{end_str}"
        
        print(f"Fetching {ticker} from {url}")  # Debug
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url, 
                params={
                    "apiKey": self.api_key,
                    "adjusted": "true"
                }
            )
            
            print(f"Response status: {response.status_code}")  # Debug
            
            if response.status_code != 200:
                print(f"Error response: {response.text}")  # Debug
                raise ValueError(f"API error {response.status_code}")
                
            data = response.json()
            print(f"Got {data.get('resultsCount', 0)} results for {ticker}")  # Debug
            
        # Check for results
        if 'results' not in data or len(data['results']) == 0:
            raise ValueError(f"No data found for {ticker}")
            
        # Convert to DataFrame
        df = pd.DataFrame(data['results'])
        df['date'] = pd.to_datetime(df['t'], unit='ms')
        df = df[['date', 'c']].rename(columns={'c': 'close'})
        df['returns'] = df['close'].pct_change()
        df = df.dropna()
        
        print(f"Processed {len(df)} rows for {ticker}")  # Debug
        
        return df
    
    async def get_portfolio_data(self, tickers: List[str]) -> Dict[str, pd.DataFrame]:
        """Fetch data for multiple stocks"""
        portfolio_data = {}
        
        # Process stocks one by one with delay for rate limiting
        for i, ticker in enumerate(tickers):
            if i > 0:
                print(f"Waiting 12 seconds for rate limit...")  # Debug
                await asyncio.sleep(12)  # Rate limit: 5 requests per minute
                
            print(f"Fetching data for {ticker}...")  # Debug
            portfolio_data[ticker] = await self.get_stock_data(ticker)
                
        return portfolio_data