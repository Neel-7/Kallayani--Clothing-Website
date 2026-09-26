# Firebase cloud rollout checklist

The application is complete for local emulator development. Cloud rollout remains an operator task because it requires the Firebase account, billing, permanent region choices, domains, and secrets.

For development and staging projects:

1. Create Native-mode Firestore and the default Storage bucket in the chosen region.
2. Enable Email/Password, anonymous, and any approved OAuth providers in Authentication.
3. Add the deployed frontend domain to Authentication authorized domains.
4. Configure backend Application Default Credentials or `FIREBASE_SERVICE_ACCOUNT_JSON`.
5. Copy the environment-specific Firebase Web configuration into the frontend deployment environment.
6. Authenticate Firebase CLI and review the explicit target project.
7. Deploy the deny-by-default client rules and indexes:

```bash
npm run firebase:deploy:dev --workspace backend
npm run firebase:deploy:staging --workspace backend
```

8. Create the first staff user and assign its custom claim from a trusted operator environment.
9. Exercise product creation, media upload, publication, storefront display, cart persistence, and an order in staging.
10. Deploy frontend and backend separately and set the frontend API base URL to the backend origin.

Never ship Firebase Admin credentials to the browser. Billing alerts notify but do not cap usage, so configure budgets and application-level monitoring before production traffic.
