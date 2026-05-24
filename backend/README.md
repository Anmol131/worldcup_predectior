This backend provides a minimal MVC API for the World Cup Predictor app.

- Copy `.env.example` to `.env` and set `MONGO_URI`.
- Run `npm install` inside `backend/`.
- Start in dev mode: `npm run dev` (uses `nodemon`).

API endpoints:
- GET `/api/health` - healthcheck
- GET `/api/groups` - list groups
- POST `/api/groups/seed` - seed default groups
- PUT `/api/groups/:groupId` - update group selection
- POST `/api/bracket/generate` - generate bracket for session
- GET `/api/bracket/:sessionId` - get bracket
- PUT `/api/bracket/:sessionId/match/:matchId` - set match winner
- POST `/api/predictions` - create prediction record
- GET `/api/predictions/share/:token` - fetch shared prediction
- PUT `/api/predictions/:sessionId/complete` - mark prediction complete
