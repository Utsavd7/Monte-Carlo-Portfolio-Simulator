// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import PortfolioInput from './components/PortfolioInput';
import SimulationControl from './components/SimulationControl';
import ResultsDisplay from './components/ResultsDisplay';
import DistributionChart from './components/charts/DistributionChart';
import SimulationPaths from './components/charts/SimulationPaths';
import RiskReturnScatter from './components/charts/RiskReturnScatter';
import { portfolioAPI } from './services/api';

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    days: 252,
    simulations: 1000
  });

  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const health = await portfolioAPI.healthCheck();
      setApiHealth(health.status === 'healthy');
    } catch (err) {
      setApiHealth(false);
    }
  };

  const handleSimulation = async () => {
    if (!portfolio || portfolio.stocks.length === 0) {
      setError('Please add at least one stock to your portfolio');
      return;
    }

    const totalWeight = portfolio.stocks.reduce((sum, stock) => sum + stock.weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      setError('Portfolio weights must sum to 100%');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await portfolioAPI.simulate(
        portfolio, 
        simulationParams.days, 
        simulationParams.simulations
      );
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Simulation failed. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Monte Carlo Portfolio Simulator
          </h1>
          <p className="hero-subtitle">
            Visualize your portfolio's future with advanced risk analysis
          </p>
          <div className={`api-status ${apiHealth ? 'healthy' : 'unhealthy'}`}>
            <span className="status-dot"></span>
            API {apiHealth ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">📈</div>
          <div className="floating-card card-2">💰</div>
          <div className="floating-card card-3">📊</div>
        </div>
      </div>

      <div className="main-content">
        <div className="input-section">
          <div className="card">
            <h2>Build Your Portfolio</h2>
            <PortfolioInput onPortfolioChange={setPortfolio} />
          </div>
          
          <div className="card">
            <h2>Simulation Settings</h2>
            <SimulationControl 
              onSimulate={handleSimulation}
              loading={loading}
              disabled={!portfolio || !apiHealth}
              onParamsChange={setSimulationParams}
              params={simulationParams}
            />
          </div>
        </div>

        {error && (
          <div className="error-message animate-in">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Running {simulationParams.simulations.toLocaleString()} simulations...</p>
          </div>
        )}

        {results && !loading && (
          <>
            <div className="results-section animate-in">
              <ResultsDisplay results={results} />
            </div>

            <div className="charts-section">
              <div className="chart-grid">
                <div className="card chart-card">
                  <h3>Portfolio Value Distribution</h3>
                  <DistributionChart data={results.simulation_data.final_values} />
                </div>
                
                <div className="card chart-card">
                  <h3>Simulation Paths</h3>
                  <SimulationPaths paths={results.simulation_data.paths_sample} />
                </div>
                
                <div className="card chart-card full-width">
                  <h3>Risk vs Return Analysis</h3>
                  <RiskReturnScatter 
                    results={results} 
                    portfolio={portfolio}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        <p>Built with React & FastAPI | Powered by Polygon.io</p>
      </footer>
    </div>
  );
}

export default App;