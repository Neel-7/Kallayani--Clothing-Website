# Kallayani — Development Architecture & Local Execution Guide

This document provides a comprehensive technical overview of how the **Frontend**, **Backend**, and **Firebase Emulator Suite** integrate during development, followed by an operational runbook for local execution.

---

## 1. System Architecture & Topology

The Kallayani workspace is an npm workspaces monorepo separating client UI concerns from data governance:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          BROWSER CLIENT                                │
│                                                                        │
│   ┌────────────────────────────────┐  ┌────────────────────────────┐   │
│   │   Storefront & Customer App    │  │  Catalogue Admin Studio    │   │
│   │   (React 19 / RTK Query)       │  │  (Lazy route: /admin/*)    │   │
│   └───────────────┬────────────────┘  └─────────────┬──────────────┘   │
│                   │                                 │                  │
│       Client Auth │ (Direct SDK)        Client Auth │ (Isolated App)   │
│       (Customer)  ▼                     (Staff)     ▼                  │
└───────────────────┼─────────────────────────────────┼──────────────────┘
                    │                                 │
                    ▼                                 ▼
         ┌──────────────────────────────────────────────────────┐
         │             Firebase Auth Emulator (9099)            │
         └──────────────────────────────────────────────────────┘
                    │                                 │
      Issues Customer ID Token           Issues Staff ID Token
                    │                                 │
                    ▼                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        VITE DEV SERVER (5173)                          │
│   Reverse Proxies: /api/*  ───►  http://127.0.0.1:3001                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Requests with Bearer Tokens
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       EXPRESS BACKEND (3001)                           │
│                                                                        │
│   Middleware:                                                          │
│   • pino-http (Request tracing with X-Request-Id)                      │
│   • helmet, cors, compression                                          │
│   • rateLimit (/api: 3,000 req/min in dev)                             │
│   • requireAuth (Verifies Firebase ID token)                           │
│   • requireStaff / requireAdmin (Checks token custom claims)           │
│                                                                        │
│   Services:                                                            │
│   • storefront-service (Catalogue queries, home page data)             │
│   • order-service & user-service (Transactions, stock decrement)       │
│   • product-service (Admin CRUD, slug validation)                      │
│   • media-service (Sharp processing -> WebP images & thumbnails)       │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
                    ▼                               ▼
       ┌────────────────────────┐      ┌─────────────────────────┐
       │   Firestore (8080)     │      │ Firebase Storage (9199) │
       │   Catalogue, Orders,   │      │ Optimized Product Media │
       │   Cart/Wishlist state  │      │ Originals & Thumbnails  │
       └────────────────────────┘      └─────────────────────────┘
                    ▲                               ▲
                    └───────────────┬───────────────┘
                                    │
                       ┌────────────────────────┐
                       │ Firebase UI (4000)     │
                       │ Live Emulator Insights │
                       └────────────────────────┘
```

---

## 2. Frontend-Backend Integration Mechanics

### 2.1 Network Proxying (Vite to Express)
In development, the browser talks only to port `5173` to prevent Cross-Origin Resource Sharing (CORS) friction and cookie/header routing issues.

- **Vite Proxy (`frontend/vite.config.ts`)**:
  ```ts
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  }
  ```
- **Redux Toolkit Query Base URL**: All RTK Query base queries target `import.meta.env.VITE_API_BASE_URL || "/api/v1"`.
- Any request made to `http://localhost:5173/api/v1/...` is transparently forwarded to `http://127.0.0.1:3001/api/v1/...`.

### 2.2 Authentication & Dual Firebase App Architecture
The system employs strict separation of privileges between customers and catalogue staff:

1. **Customer SDK Instance (`frontend/src/lib/firebase.ts`)**:
   - Manages regular shopper authentication.
   - Initialized via `firebaseApp = initializeApp(firebaseConfig)`.
   - Wired to Auth emulator: `connectAuthEmulator(auth, "http://127.0.0.1:9099")`.

2. **Admin SDK Instance (`frontend/src/lib/firebase-admin-client.ts`)**:
   - Manages back-office staff credentials under a secondary named app: `kallayani-catalogue-admin`.
   - Guarantees staff sign-in does not overwrite or collide with shopper sessions in local storage.

3. **Token Transmission (`store/admin-api.ts` & `store/customer-api.ts`)**:
   - RTK Query `prepareHeaders` automatically extracts the current ID token:
     ```ts
     prepareHeaders: async (headers) => {
       const token = await auth.currentUser?.getIdToken();
       if (token) headers.set("authorization", `Bearer ${token}`);
       return headers;
     }
     ```

4. **Token Verification on Express (`backend/src/middleware/auth.ts`)**:
   - `requireAuth` strips `Bearer <token>`, calls `firebaseAuth.verifyIdToken(token, true)` using Firebase Admin SDK.
   - `requireStaff` checks for custom claim: `request.auth?.role === "admin" || request.auth?.role === "manager"`.
   - `requireAdmin` checks for `request.auth?.role === "admin"`.

### 2.3 Shared Environment Injection
The project avoids duplicating `.env` files between `frontend` and `backend`.
- All local keys are configured in `frontend/.env.local`.
- Backend scripts (`backend/package.json`) use Node's native flag:
  `--env-file=../frontend/.env.local`
- Backend development runner imports `backend/scripts/firebase-development-env.mjs` to dynamically bind:
  - `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`
  - `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`
  - `FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199`
  - `STORAGE_EMULATOR_HOST=http://127.0.0.1:9199`

### 2.4 State Synchronization (`FirebaseShopSync`)
- Customer carts and wishlists live locally in Redux Toolkit for immediate UI feedback.
- When an authenticated customer is detected, `frontend/src/components/FirebaseShopSync.tsx` synchronizes local Redux cart/wishlist state with `/api/v1/users/me/commerce`.
- Inventory validation and stock deductions are executed as atomic Firestore transactions during checkout via `/api/v1/users/me/orders`.

### 2.5 Media Pipeline
- Catalogue admins upload images in `/admin/products`.
- Express handles the multipart stream in memory via `multer`.
- `backend/src/services/media-service.ts` uses `sharp` to transcode images into WebP format (generating both full-size originals and responsive thumbnails).
- Images are stored directly into the Firebase Storage Emulator bucket (`9199`).

---

## 3. Port Allocations & Endpoints

| Port | Service | Description | URL |
| :--- | :--- | :--- | :--- |
| **5173** | **Frontend Client** | Vite React app (Storefront & Admin Studio) | `http://localhost:5173` |
| **3001** | **Backend API** | Express REST server | `http://localhost:3001` |
| **4000** | **Firebase Emulator UI** | Visual dashboard for Auth, Firestore & Storage | `http://localhost:4000` |
| **8080** | **Firestore Emulator** | NoSQL Document Database | `127.0.0.1:8080` |
| **9099** | **Auth Emulator** | Firebase Authentication mock engine | `127.0.0.1:9099` |
| **9199** | **Storage Emulator** | Firebase Cloud Storage bucket mock | `127.0.0.1:9199` |

---

## 4. Local Execution Runbook

### Step 0: Prerequisites Check
Ensure your machine meets the runtime requirements:
- **Node.js**: v20+ or v22+ (`node -v`)
- **Java**: Java 17+ or 21+ (`java -version`).
  *(The backend scripts automatically find Android Studio's bundled JBR at `/opt/android-studio/jbr/bin/java` if present).*

Ensure dependencies are installed:
```bash
npm install
```

---

### Step 1: Start the Firebase Emulators
In your first terminal tab:
```bash
npm run firebase:emulators --workspace backend
```
*Wait until you see:*
```
✔  All emulators ready! It is now safe to connect your app.
┌───────────┬──────────────┬────────────────────────────────┐
│ Emulator  │ Host:Port    │ View at ...                    │
├───────────┼──────────────┼────────────────────────────────┤
│ Auth      │ 127.0.0.1:9099 │                                │
│ Firestore │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore│
│ Storage   │ 127.0.0.1:9199 │ http://127.0.0.1:4000/storage  │
│ Emulator UI│ 127.0.0.1:4000 │ http://127.0.0.1:4000          │
└───────────┴──────────────┴────────────────────────────────┘
```

---

### Step 2: Seed Firestore Database (Run Once)
In a second terminal tab, populate the Firestore emulator with products, collections, hero slides, and editorial data:
```bash
npm run firebase:seed --workspace backend
```
*(To verify data integrity afterwards: `npm run firebase:verify --workspace backend`)*

---

### Step 3: Start the Backend API Server
In your backend terminal tab:
```bash
npm run dev:backend
```
*Expected log output:*
```
{"level":30,"port":3001,"firebaseProjectId":"...","emulators":true,"msg":"Kallayani API listening on http://localhost:3001"}
```

You can verify it by opening `http://localhost:3001/health` in your browser.

---

### Step 4: Start the Frontend Storefront
In your frontend terminal tab:
```bash
npm run dev:frontend
```
*Expected output:*
```
VITE v6.2.0 ready in ... ms
➜ Local: http://localhost:5173/
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### Step 5: (Optional) Creating an Admin User
To access the Admin Studio (`http://localhost:5173/admin`):

1. Go to `http://localhost:5173/signup` and register a new user (e.g. `admin@kallayani.test`).
2. Run the role assignment CLI command in your terminal:
   ```bash
   npm run firebase:set-role --workspace backend -- admin@kallayani.test admin
   ```
3. Type `assign` when prompted.
4. Log out and log back in on the web app to refresh the user's ID token claims. You can now access `http://localhost:5173/admin`.

---

## 5. Maintenance & Troubleshooting

### Freeing Occupied Ports
If any previous process crashed or remained running in the background:
```bash
fuser -k 5173/tcp 3001/tcp 4000/tcp 8080/tcp 9099/tcp 9199/tcp
```

### Type Checking & Linting
Validate full workspace consistency across frontend and backend:
```bash
npm run typecheck
npm run lint
```

### Production Build Test
Verify both projects compile cleanly for production:
```bash
npm run build
```
