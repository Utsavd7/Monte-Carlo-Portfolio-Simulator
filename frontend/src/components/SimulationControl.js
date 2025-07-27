import React from 'react';
import './SimulationControl.css';

const SimulationControl = ({ onSimulate, loading, disabled, onParamsChange, params }) => {
  const presets = [
    { label: '1 Month', days: 21 },
    { label: '3 Months', days: 63 },
    { label: '6 Months', days: 126 },
    { label: '1 Year', days: 252 },
    { label: '2 Years', days: 504 },
    { label: '5 Years', days: 1260 },
  ];

  const simulationPresets = [
    { label: 'Quick', value: 100 },
    { label: 'Standard', value: 1000 },
    { label: 'Detailed', value: 5000 },
    { label: 'Precise', value: 10000 },
  ];

  return (
    <div className="simulation-control">
      <div className="control-group">
        <label className="control-label">Investment Horizon</label>
        <div className="preset-buttons">
          {presets.map((preset) => (
            <button
              key={preset.days}
              className={`preset-btn ${params.days === preset.days ? 'active' : ''}`}
              onClick={() => onParamsChange({ ...params, days: preset.days })}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="custom-input">
          <input
            type="number"
            value={params.days}
            onChange={(e) => onParamsChange({ ...params, days: parseInt(e.target.value) || 252 })}
            min="1"
            max="2520"
          />
          <span className="input-suffix">trading days</span>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">Simulation Count</label>
        <div className="preset-buttons">
          {simulationPresets.map((preset) => (
            <button
              key={preset.value}
              className={`preset-btn ${params.simulations === preset.value ? 'active' : ''}`}
              onClick={() => onParamsChange({ ...params, simulations: preset.value })}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="simulation-slider">
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={params.simulations}
            onChange={(e) => onParamsChange({ ...params, simulations: parseInt(e.target.value) })}
            className="sim-slider"
          />
          <div className="slider-labels">
            <span>100</span>
            <span className="current-value">{params.simulations.toLocaleString()}</span>
            <span>10,000</span>
          </div>
        </div>
      </div>

      <div className="simulation-info">
        <div className="info-item">
          <span className="info-icon">📊</span>
          <div>
            <strong>Accuracy</strong>
            <p>More simulations = higher accuracy</p>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">⏱️</span>
          <div>
            <strong>Processing Time</strong>
            <p>~{Math.round(params.simulations / 1000)} seconds</p>
          </div>
        </div>
      </div>

      <button
        className="simulate-button"
        onClick={onSimulate}
        disabled={loading || disabled}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Running Simulation...
          </>
        ) : (
          <>
            <span className="btn-icon">🚀</span>
            Run Monte Carlo Simulation
          </>
        )}
      </button>
    </div>
  );
};

export default SimulationControl;