# Kallayani

Production-oriented commerce foundation with independently runnable applications:

- `frontend/`: React, Vite, Redux Toolkit, RTK Query, Firebase Authentication
- `backend/`: Express, Firebase Admin, Firestore, Storage, Sharp, Zod

## Data and resources

The browser authenticates with Firebase, then sends its ID token to Express. Express owns all Firestore, inventory, order, and Storage operations. New product images live in Firebase Storage; Firestore stores their metadata. Local `frontend/public/images/` files are seed/migration assets.

## Run locally

```bash
npm run firebase:emulators --workspace backend
npm run firebase:seed --workspace backend
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173` · API: `http://localhost:3001` · Firebase UI: `http://localhost:4000`

Validate with `npm run typecheck`, `npm run lint`, and `npm run build`.

## End goal

A polished storefront and simple staff admin connected to a secure API, remotely managed catalogue/media, reliable stock and orders, and separately deployable frontend/backend services. Payment, shipping, tax, and email providers can be added behind the existing order API.
