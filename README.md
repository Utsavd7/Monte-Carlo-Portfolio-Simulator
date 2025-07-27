# Monte Carlo Portfolio Simulator

A streamlined web application for portfolio risk analysis using Monte Carlo simulations.

## Features
- Real-time stock data from Polygon.io
- 1000+ Monte Carlo simulations
- Interactive visualizations with Plotly
- Key risk metrics (VaR, Sharpe, volatility)

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Tech Stack
- **Backend**: FastAPI, NumPy, Pandas
- **Frontend**: React, Plotly.js
- **Data**: Polygon.io API
