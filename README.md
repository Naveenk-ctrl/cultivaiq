# CultivAIQ

Smart Farming Assistant System.

## Environment Setup

### Server (.env)
Create `server/.env` with:


### Client (.env)
Create `client/cultivaiq/.env` with:

```
VITE_API_URL=http://localhost:5000/api
```

### ML API (.env)
Create `ml-api/.env` with:

```
FLASK_ENV=development
```

## Quick Start

### Client
1. `cd client/cultivaiq`
2. `npm install`
3. `npm run dev`

### Server
1. `cd server`
2. Copy `.env.example` to `.env`
3. `npm install`
4. `npm run dev`

### ML API (Mock)
1. `cd ml-api`
2. Create venv and activate
3. `pip install -r requirements.txt`
4. `python app.py`

## Running Order
1. Start ML API (port 7000)
2. Start server (port 5000)
3. Start client (port 5173/5174)

## Health Checks
- Server: `http://localhost:5000/api/health`
- ML API: `http://localhost:7000/health`
