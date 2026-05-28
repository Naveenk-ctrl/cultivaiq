# CultivAIQ Server

## Setup
1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

Optional:
- Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) to enable the Gemini chatbot.

## API
- POST `/api/register`
- POST `/api/login`
- POST `/api/upload`
- POST `/api/predict`
- POST `/api/recommend/crop`
- POST `/api/chat`
- GET `/api/health`
- GET `/api/weather?lat=..&lon=..`
- GET `/api/market?commodity=..`
