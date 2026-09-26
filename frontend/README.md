# Frontend

React/Vite renders the storefront and admin studio. Redux Toolkit owns application state; RTK Query calls the Express API and caches server data. Firebase Web SDK is used only for Authentication.

- `src/store/`: Redux state and API clients
- `src/pages/`: storefront, authentication, and admin screens
- `src/components/`: reusable interface components
- `public/images/`: legacy seed/migration and permanent brand assets only
- Style goal: warm editorial commerce, clear purchasing controls, responsive and accessible

Run: `npm run dev:frontend`

Configuration: copy `.env.example` to `.env.local` and add the Firebase Web values.
