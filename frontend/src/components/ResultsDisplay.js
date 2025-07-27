import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results }) => {
  const metrics = [
    {
      label: 'Expected Annual Return',
      value: `${(results.expected_return * 100).toFixed(2)}%`,
      icon: '📈',
      color: results.expected_return > 0 ? 'positive' : 'negative',
      description: 'Average expected portfolio return'
    },
    {
      label: 'Annual Volatility',
      value: `${(results.volatility * 100).toFixed(2)}%`,
      icon: '📊',
      color: 'neutral',
      description: 'Portfolio standard deviation'
    },
    {
      label: 'Sharpe Ratio',
      value: results.sharpe_ratio.toFixed(3),
      icon: '⚖️',
      color: results.sharpe_ratio > 1 ? 'positive' : results.sharpe_ratio > 0.5 ? 'neutral' : 'negative',
      description: 'Risk-adjusted return metric'
    },
    {
      label: '95% Value at Risk',
      value: `${(results.var_95 * 100).toFixed(2)}%`,
      icon: '🎯',
      color: results.var_95 < -0.2 ? 'negative' : 'neutral',
      description: '5% chance of losing more than this'
    }
  ];

  const getSharpeInterpretation = (sharpe) => {
    if (sharpe > 2) return { text: 'Excellent', color: 'excellent' };
    if (sharpe > 1) return { text: 'Good', color: 'good' };
    if (sharpe > 0.5) return { text: 'Acceptable', color: 'acceptable' };
    if (sharpe > 0) return { text: 'Poor', color: 'poor' };
    return { text: 'Negative', color: 'negative' };
  };

  const sharpeInterp = getSharpeInterpretation(results.sharpe_ratio);

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>Simulation Results</h2>
        <div className="results-badge">
          <span className="badge-icon">✨</span>
          Analysis Complete
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className={`metric-card ${metric.color}`}>
            <div className="metric-header">
              <span className="metric-icon">{metric.icon}</span>
              <h3>{metric.label}</h3>
            </div>
            <div className="metric-value">{metric.value}</div>
            <p className="metric-description">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-icon">💡</span>
              <h4>Risk Assessment</h4>
            </div>
            <p>
              Your portfolio has a Sharpe ratio of {results.sharpe_ratio.toFixed(3)}, which is considered{' '}
              <span className={`highlight ${sharpeInterp.color}`}>{sharpeInterp.text}</span>.
              {results.sharpe_ratio > 1 
                ? ' This indicates good risk-adjusted returns.' 
                : ' Consider rebalancing for better risk-adjusted returns.'}
            </p>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-icon">📉</span>
              <h4>Downside Risk</h4>
            </div>
            <p>
              There's a 5% chance your portfolio could lose more than{' '}
              <span className="highlight negative">{Math.abs(results.var_95 * 100).toFixed(1)}%</span>{' '}
              of its value. This is your Value at Risk (VaR) metric.
            </p>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-icon">🎯</span>
              <h4>Return Expectations</h4>
            </div>
            <p>
              Based on historical data, your expected annual return is{' '}
              <span className={`highlight ${results.expected_return > 0 ? 'positive' : 'negative'}`}>
                {(results.expected_return * 100).toFixed(1)}%
              </span>
              {results.expected_return > 0.1 
                ? ', outperforming many traditional investments.' 
                : results.expected_return > 0 
                ? ', providing modest growth potential.'
                : ', suggesting you may want to reconsider your allocation.'}
            </p>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <p>
          <strong>Important:</strong> These results are based on historical data and Monte Carlo simulations. 
          Past performance does not guarantee future results. Always consult with a financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;