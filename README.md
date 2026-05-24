# World Cup 2026 Predictor

## Setup
1. `npm run install:all`
2. Create `backend/.env` by copying `backend/.env.example`
3. Make sure MongoDB is running locally
4. `npm run dev` to start both frontend and backend

## Features
- Pick group stage winners (1st, 2nd, 3rd per group)
- Auto-generate knockout bracket
- Pick match winners round by round
- Share your bracket with a unique link
- View friends' predictions in read-only mode

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Query
- Backend: Node.js, Express, MongoDB, Mongoose
- Pattern: MVC (Models, Controllers, Routes)

## Coming Soon
- User authentication (Google login)
- Leaderboard
- Live score sync
- Admin panel
- Stats dashboard