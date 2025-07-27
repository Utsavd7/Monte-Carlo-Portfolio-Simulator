import React from 'react';
import Plot from 'react-plotly.js';

const RiskReturnScatter = ({ results, portfolio }) => {
  // Generate sample portfolios for comparison
  const generateRandomPortfolios = (numPortfolios = 100) => {
    const portfolios = [];
    for (let i = 0; i < numPortfolios; i++) {
      // Random returns between -10% and 30%
      const returnVal = (Math.random() * 0.4 - 0.1);
      // Random volatility between 5% and 40%
      const volatility = (Math.random() * 0.35 + 0.05);
      portfolios.push({ return: returnVal, volatility: volatility });
    }
    return portfolios;
  };

  const randomPortfolios = generateRandomPortfolios();

  const traces = [
    // Random portfolios
    {
      x: randomPortfolios.map(p => p.volatility * 100),
      y: randomPortfolios.map(p => p.return * 100),
      mode: 'markers',
      type: 'scatter',
      name: 'Other Portfolios',
      marker: {
        color: '#e2e8f0',
        size: 8,
        line: {
          color: '#cbd5e1',
          width: 1
        }
      },
      hovertemplate: 'Risk: %{x:.1f}%<br>Return: %{y:.1f}%<extra></extra>'
    },
    // Current portfolio
    {
      x: [results.volatility * 100],
      y: [results.expected_return * 100],
      mode: 'markers+text',
      type: 'scatter',
      name: 'Your Portfolio',
      marker: {
        color: '#6366f1',
        size: 20,
        line: {
          color: '#4f46e5',
          width: 3
        },
        symbol: 'star'
      },
      text: ['Your Portfolio'],
      textposition: 'top center',
      textfont: {
        size: 14,
        color: '#4f46e5',
        weight: 600
      },
      hovertemplate: 'Your Portfolio<br>Risk: %{x:.2f}%<br>Return: %{y:.2f}%<br>Sharpe: ' + results.sharpe_ratio.toFixed(3) + '<extra></extra>'
    }
  ];

  // Add efficient frontier curve
  const efficientFrontier = [];
  for (let risk = 5; risk <= 35; risk += 1) {
    // Simplified efficient frontier calculation
    const maxReturn = Math.sqrt(risk / 100) * 40 - 5;
    efficientFrontier.push({ x: risk, y: maxReturn });
  }

  traces.push({
    x: efficientFrontier.map(p => p.x),
    y: efficientFrontier.map(p => p.y),
    mode: 'lines',
    type: 'scatter',
    name: 'Efficient Frontier',
    line: {
      color: '#10b981',
      width: 3,
      dash: 'dash'
    },
    hovertemplate: 'Efficient Frontier<br>Risk: %{x:.1f}%<br>Return: %{y:.1f}%<extra></extra>'
  });

  const layout = {
    title: '',
    xaxis: {
      title: 'Annual Volatility (Risk) %',
      showgrid: true,
      gridcolor: '#f0f0f0',
      range: [0, 40]
    },
    yaxis: {
      title: 'Expected Annual Return %',
      showgrid: true,
      gridcolor: '#f0f0f0',
      zeroline: true,
      zerolinecolor: '#94a3b8',
      zerolinewidth: 2,
      range: [-15, 35]
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 12,
      color: '#64748b'
    },
    margin: { t: 20, r: 20, b: 60, l: 60 },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#e2e8f0',
      borderwidth: 1
    },
    annotations: [
      {
        x: 5,
        y: 30,
        text: 'High Return<br>Low Risk',
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: '#10b981',
        ax: -40,
        ay: -40,
        font: {
          size: 12,
          color: '#10b981'
        }
      },
      {
        x: 35,
        y: -10,
        text: 'High Risk<br>Low Return',
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: '#ef4444',
        ax: 40,
        ay: 40,
        font: {
          size: 12,
          color: '#ef4444'
        }
      }
    ]
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Plot
        data={traces}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default RiskReturnScatter;