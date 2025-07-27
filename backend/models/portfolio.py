# backend/models/portfolio.py
from pydantic import BaseModel, validator
from typing import List, Dict

class Stock(BaseModel):
    ticker: str
    weight: float
    
    @validator('weight')
    def weight_must_be_positive(cls, v):
        if v <= 0 or v > 1:
            raise ValueError('Weight must be between 0 and 1')
        return v

class Portfolio(BaseModel):
    stocks: List[Stock]
    
    @validator('stocks')
    def weights_must_sum_to_one(cls, v):
        total_weight = sum(stock.weight for stock in v)
        if abs(total_weight - 1.0) > 0.01:
            raise ValueError('Weights must sum to 1.0')
        return v

class SimulationRequest(BaseModel):
    portfolio: Portfolio
    days: int = 252  # 1 year
    simulations: int = 1000

class SimulationResult(BaseModel):
    expected_return: float
    volatility: float
    sharpe_ratio: float
    var_95: float
    simulation_data: Dict