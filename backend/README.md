# Backend

Express is the only data gateway. It verifies Firebase ID tokens, validates input, applies customer/staff roles, and accesses Firestore and Storage through Firebase Admin.

- `routes/`: public storefront, customer, order, and admin APIs
- `schemas/`: Zod request validation
- `services/`: catalogue, content, inventory, images, users, and orders
- Images: Sharp creates WebP original/thumbnail files in Firebase Storage
- Inventory: Firestore transactions validate stock and decrement variants when orders are created

Run: `npm run dev:backend`

Production: provide `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FRONTEND_ORIGIN`, and trusted Admin credentials.
