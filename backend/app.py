# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from config import get_settings
from models.portfolio import SimulationRequest, SimulationResult
from services.data_fetcher import DataFetcher
from services.monte_carlo import MonteCarloSimulator

app = FastAPI(title="Portfolio Monte Carlo Simulator")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings = get_settings()

@app.get("/")
def root():
    return {
        "message": "Portfolio Monte Carlo Simulator API",
        "docs": "Visit /docs for API documentation",
        "health": "Visit /health to check status"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "api_key_set": bool(settings.polygon_api_key)}

# In backend/app.py, update the simulate endpoint:

@app.post("/simulate", response_model=SimulationResult)
async def run_simulation(request: SimulationRequest):
    print(f"Received simulation request: {request}")  # Debug
    
    try:
        # Check API key
        if not settings.polygon_api_key:
            raise HTTPException(
                status_code=500, 
                detail="Polygon API key not configured"
            )
        
        print(f"API Key present: {len(settings.polygon_api_key)} chars")  # Debug
        
        # Extract tickers and weights
        tickers = [stock.ticker for stock in request.portfolio.stocks]
        weights = np.array([stock.weight for stock in request.portfolio.stocks])
        
        print(f"Tickers: {tickers}")  # Debug
        print(f"Weights: {weights}")  # Debug
        
        # Fetch data
        fetcher = DataFetcher(settings.polygon_api_key)
        portfolio_data = await fetcher.get_portfolio_data(tickers)
        
        print(f"Fetched data for {len(portfolio_data)} stocks")  # Debug
        
        # Run simulation
        simulator = MonteCarloSimulator(portfolio_data)
        results = simulator.simulate(weights, request.days, request.simulations)
        
        return SimulationResult(
            expected_return=results['expected_return'],
            volatility=results['volatility'],
            sharpe_ratio=results['sharpe_ratio'],
            var_95=results['var_95'],
            simulation_data={
                'final_values': results['final_values'].tolist(),
                'paths_sample': results['paths_sample']
            }
        )
        
    except ValueError as e:
        print(f"ValueError: {str(e)}")  # Debug
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Exception: {type(e).__name__}: {str(e)}")  # Debug
        import traceback
        traceback.print_exc()  # Full error trace
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.backend_port)