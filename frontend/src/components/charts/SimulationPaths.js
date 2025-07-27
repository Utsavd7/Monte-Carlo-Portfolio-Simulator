import React from 'react';
import Plot from 'react-plotly.js';

const SimulationPaths = ({ paths }) => {
  const traces = paths.slice(0, 50).map((path, index) => {
    const finalValue = path[path.length - 1];
    const color = finalValue >= 1 ? '#10b981' : '#ef4444';
    
    return {
      x: Array.from({ length: path.length }, (_, i) => i),
      y: path.map(v => (v - 1) * 100),
      type: 'scatter',
      mode: 'lines',
      line: {
        color: color,
        width: 1
      },
      opacity: 0.3,
      showlegend: false,
      hovertemplate: 'Day: %{x}<br>Return: %{y:.1f}%<extra></extra>'
    };
  });

  // Add average path
  const avgPath = paths[0].map((_, dayIndex) => {
    const dayValues = paths.map(path => path[dayIndex]);
    return dayValues.reduce((a, b) => a + b, 0) / dayValues.length;
  });

  traces.push({
    x: Array.from({ length: avgPath.length }, (_, i) => i),
    y: avgPath.map(v => (v - 1) * 100),
    type: 'scatter',
    mode: 'lines',
    name: 'Average Path',
    line: {
      color: '#6366f1',
      width: 3
    },
    hovertemplate: 'Day: %{x}<br>Avg Return: %{y:.1f}%<extra></extra>'
  });

  const layout = {
    title: '',
    xaxis: {
      title: 'Trading Days',
      showgrid: true,
      gridcolor: '#f0f0f0',
    },
    yaxis: {
      title: 'Cumulative Return (%)',
      showgrid: true,
      gridcolor: '#f0f0f0',
      zeroline: true,
      zerolinecolor: '#94a3b8',
      zerolinewidth: 2
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
    shapes: [{
      type: 'line',
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 0,
      xref: 'paper',
      line: {
        color: '#64748b',
        width: 1,
        dash: 'dash'
      }
    }]
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

export default SimulationPaths;