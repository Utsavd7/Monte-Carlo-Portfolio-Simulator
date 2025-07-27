import React from 'react';
import Plot from 'react-plotly.js';

const DistributionChart = ({ data }) => {
  const layout = {
    title: '',
    xaxis: {
      title: 'Portfolio Return (%)',
      tickformat: '.1%',
      showgrid: true,
      gridcolor: '#f0f0f0',
    },
    yaxis: {
      title: 'Frequency',
      showgrid: true,
      gridcolor: '#f0f0f0',
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      size: 12,
      color: '#64748b'
    },
    margin: { t: 20, r: 20, b: 60, l: 60 },
    bargap: 0.1,
    shapes: [{
      type: 'line',
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 1,
      yref: 'paper',
      line: {
        color: '#ef4444',
        width: 2,
        dash: 'dash'
      }
    }],
    annotations: [{
      x: 0,
      y: 1.05,
      yref: 'paper',
      text: 'Break Even',
      showarrow: false,
      font: {
        size: 12,
        color: '#ef4444'
      }
    }]
  };

  const trace = {
    x: data,
    type: 'histogram',
    nbinsx: 50,
    marker: {
      color: data.map(d => d >= 0 ? '#10b981' : '#ef4444'),
      line: {
        color: '#fff',
        width: 1
      }
    },
    opacity: 0.8,
    hovertemplate: 'Return: %{x:.1%}<br>Count: %{y}<extra></extra>'
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Plot
        data={[trace]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default DistributionChart;