# backend/services/monte_carlo.py
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple

class MonteCarloSimulator:
    def __init__(self, portfolio_data: Dict[str, pd.DataFrame]):
        self.portfolio_data = portfolio_data
        self.prepare_data()
        
    def prepare_data(self):
        """Calculate returns and covariance matrix"""
        # Align all dataframes by date
        returns_data = {}
        for ticker, df in self.portfolio_data.items():
            returns_data[ticker] = df.set_index('date')['returns']
        
        self.returns_df = pd.DataFrame(returns_data).dropna()
        self.mean_returns = self.returns_df.mean()
        self.cov_matrix = self.returns_df.cov()
        
    def simulate(self, weights: np.ndarray, days: int, simulations: int) -> Dict:
        """Run Monte Carlo simulation"""
        # Annual statistics
        portfolio_return = np.sum(self.mean_returns * weights) * 252
        portfolio_std = np.sqrt(np.dot(weights.T, np.dot(self.cov_matrix * 252, weights)))
        
        # Generate random returns
        np.random.seed(42)  # For reproducibility
        
        # Simulation
        simulation_results = []
        
        for _ in range(simulations):
            daily_returns = np.random.multivariate_normal(
                self.mean_returns, 
                self.cov_matrix, 
                days
            )
            
            # Calculate portfolio returns
            portfolio_daily_returns = np.dot(daily_returns, weights)
            cumulative_return = np.prod(1 + portfolio_daily_returns) - 1
            simulation_results.append(cumulative_return)
        
        simulation_results = np.array(simulation_results)
        
        return {
            'final_values': simulation_results,
            'expected_return': portfolio_return,
            'volatility': portfolio_std,
            'sharpe_ratio': portfolio_return / portfolio_std if portfolio_std > 0 else 0,
            'var_95': np.percentile(simulation_results, 5),
            'paths_sample': self._generate_sample_paths(weights, days, 100)
        }
    
    def _generate_sample_paths(self, weights: np.ndarray, days: int, n_paths: int) -> List[List[float]]:
        """Generate sample paths for visualization"""
        paths = []
        for _ in range(n_paths):
            daily_returns = np.random.multivariate_normal(
                self.mean_returns, 
                self.cov_matrix, 
                days
            )
            portfolio_returns = np.dot(daily_returns, weights)
            cumulative_values = np.cumprod(1 + portfolio_returns)
            paths.append(cumulative_values.tolist())
        return paths