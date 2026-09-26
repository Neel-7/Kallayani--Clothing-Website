# Firebase development workflow

## Architecture

Firebase Authentication runs in the browser because it owns sign-in, registration, Google sign-in, password reset, anonymous sessions, and ID-token refresh. All application data flows through Express:

```text
React + Redux Toolkit
        |
        | HTTPS + Firebase ID token
        v
Express API
        |
        +-- Firebase Admin SDK --> Firestore
        +-- Sharp -------------> Firebase Storage
```

Firestore and Storage rules deny browser access. The Firebase Admin SDK bypasses those rules only inside the trusted backend, after Express has authenticated the request, validated the payload, and enforced its role.

## Local startup

Create `frontend/.env.local` from `frontend/.env.example`, then use four terminals:

```bash
npm run firebase:emulators --workspace backend
npm run firebase:seed --workspace backend
npm run dev:backend
npm run dev:frontend
```

Local development always uses the Firebase emulators. Use `npm run dev:cloud --workspace frontend` only for a deliberate cloud frontend test.

| Service | URL |
| --- | --- |
| React storefront and admin | `http://localhost:5173` |
| Express API | `http://localhost:3001` |
| API health | `http://localhost:3001/health` |
| Emulator UI | `http://localhost:4000` |
| Firestore | `127.0.0.1:8080` |
| Authentication | `127.0.0.1:9099` |
| Storage | `127.0.0.1:9199` |

Emulator data is temporary and never appears in Firebase Console. Re-run the seed after an emulator restart.

## Data ownership

Firestore is the catalogue and customer-data source of truth. Redux Toolkit Query owns remote frontend state and caching. The local catalogue modules under `frontend/src/data/` remain fixtures for emulator seeding and migration recovery only.

The current collections are:

- `products`, `collections`, `banners`, `homeCategories`, and `editorialFeatures` for catalogue content;
- `siteContent` for store-wide content;
- `users/{uid}` and `users/{uid}/commerce/state` for profiles, carts, and wishlists;
- `orders` for immutable order snapshots and status;
- `system` for schema and seed metadata.

Uploaded product images are remote Firebase Storage objects. Firestore stores their paths, tokenized delivery URLs, alt text, dimensions, and rendition metadata. Files under `frontend/public/images/` are legacy seed/migration assets and permanent brand assets, not the destination for new admin uploads.

## Commands

```bash
npm run typecheck
npm run lint
npm run build
npm run firebase:verify --workspace backend
npm run firebase:phase1:check --workspace backend
```

Cloud seeding is deliberately blocked unless the recovery flags inside the seed script are supplied. Never place a service-account key in a `VITE_` variable or commit it to Git.
