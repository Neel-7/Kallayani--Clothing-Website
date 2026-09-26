# Kallayani commerce application

The project is split into two independently runnable TypeScript applications:

- `frontend/` — React, Vite, Redux Toolkit, RTK Query, and Firebase Authentication.
- `backend/` — Express, Firebase Admin SDK, Firestore, Firebase Storage, validation, logging, and role-based authorization.

The browser never reads or writes Firestore or Storage directly. It signs users in with Firebase Authentication and sends the Firebase ID token to Express. Express verifies the token, validates every request, and performs database or media operations with the Firebase Admin SDK.

## Local development

Create `frontend/.env.local` from `frontend/.env.example`. The existing Firebase web configuration can be used there. For local emulators, set `VITE_USE_FIREBASE_EMULATORS=true`.

Run these in separate terminals:

```bash
npm run firebase:emulators --workspace backend
npm run firebase:seed --workspace backend
npm run dev:backend
npm run dev:frontend
```

Services:

- Frontend: `http://localhost:5173`
- Express API: `http://localhost:3001`
- API health: `http://localhost:3001/health`
- Firebase Emulator UI: `http://localhost:4000`

## Production credentials

The Firebase web configuration belongs only in the frontend. The backend must use Application Default Credentials or `FIREBASE_SERVICE_ACCOUNT_JSON`; never commit a service-account file. Set `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FRONTEND_ORIGIN`, and `NODE_ENV=production` in the backend deployment environment.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```
