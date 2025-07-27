import React, { useState, useEffect } from 'react';
import './PortfolioInput.css';

const PortfolioInput = ({ onPortfolioChange }) => {
  const [stocks, setStocks] = useState([
    { ticker: 'AAPL', weight: 0.4, name: 'Apple Inc.' },
    { ticker: 'GOOGL', weight: 0.3, name: 'Alphabet Inc.' },
    { ticker: 'MSFT', weight: 0.3, name: 'Microsoft Corp.' },
  ]);

  useEffect(() => {
    onPortfolioChange({ stocks });
  }, [stocks, onPortfolioChange]);

  const updateStock = (index, field, value) => {
    const newStocks = [...stocks];
    if (field === 'weight') {
      newStocks[index][field] = Math.max(0, Math.min(1, parseFloat(value) || 0));
    } else {
      newStocks[index][field] = value;
    }
    setStocks(newStocks);
  };

  const addStock = () => {
    if (stocks.length < 10) {
      setStocks([...stocks, { ticker: '', weight: 0, name: '' }]);
    }
  };

  const removeStock = (index) => {
    if (stocks.length > 1) {
      const newStocks = stocks.filter((_, i) => i !== index);
      setStocks(newStocks);
    }
  };

  const normalizeWeights = () => {
    const totalWeight = stocks.reduce((sum, stock) => sum + stock.weight, 0);
    if (totalWeight > 0) {
      const normalizedStocks = stocks.map(stock => ({
        ...stock,
        weight: stock.weight / totalWeight
      }));
      setStocks(normalizedStocks);
    }
  };

  const totalWeight = stocks.reduce((sum, stock) => sum + stock.weight, 0);
  const isValidTotal = Math.abs(totalWeight - 1.0) < 0.01;

  return (
    <div className="portfolio-input">
      <div className="stocks-list">
        {stocks.map((stock, index) => (
          <div key={index} className="stock-item">
            <div className="stock-number">{index + 1}</div>
            <div className="stock-inputs">
              <input
                type="text"
                placeholder="Ticker (e.g., AAPL)"
                value={stock.ticker}
                onChange={(e) => updateStock(index, 'ticker', e.target.value.toUpperCase())}
                className="ticker-input"
                maxLength="5"
              />
              <div className="weight-input-group">
                <input
                  type="number"
                  value={(stock.weight * 100).toFixed(0)}
                  onChange={(e) => updateStock(index, 'weight', parseFloat(e.target.value) / 100)}
                  className="weight-input"
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="weight-suffix">%</span>
              </div>
              <div className="weight-slider">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stock.weight * 100}
                  onChange={(e) => updateStock(index, 'weight', parseFloat(e.target.value) / 100)}
                  className="slider"
                />
              </div>
            </div>
            <button 
              onClick={() => removeStock(index)} 
              className="remove-btn"
              disabled={stocks.length === 1}
              title="Remove stock"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="portfolio-actions">
        <button 
          onClick={addStock} 
          className="add-stock-btn"
          disabled={stocks.length >= 10}
        >
          <span className="btn-icon">+</span>
          Add Stock
        </button>
        
        <div className="weight-summary">
          <div className={`total-weight ${isValidTotal ? 'valid' : 'invalid'}`}>
            Total: {(totalWeight * 100).toFixed(0)}%
          </div>
          {!isValidTotal && (
            <button onClick={normalizeWeights} className="normalize-btn">
              Auto-balance
            </button>
          )}
        </div>
      </div>

      <div className="portfolio-tips">
        <p className="tip">💡 Tip: Use the sliders for easy weight adjustment</p>
      </div>
    </div>
  );
};

export default PortfolioInput;