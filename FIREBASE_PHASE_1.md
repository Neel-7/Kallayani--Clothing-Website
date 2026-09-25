# Firebase Phase 1 — Environment Stabilization

Phase 1 prepares two isolated, non-production Firebase environments. It does not move catalogue images to Storage or add the administration UI.

## Intended outcome

- Development uses `kallayani-storefront-dev`.
- Staging uses `kallayani-storefront-staging`.
- Firestore rules and indexes can be deployed independently to either project.
- Storage starts closed to every client until the staff and media rules are implemented.
- The existing storefront continues to use Firestore metadata and repository-hosted images.
- No production Firebase project is introduced yet.

## Repository setup

The repository now contains:

- `firebase.json` entries for Firestore rules, Firestore indexes, and Storage rules;
- `.firebaserc.example` aliases for `dev` and `staging`;
- a deny-by-default `storage.rules` baseline;
- environment-scoped deployment commands; and
- an offline Phase 1 preflight check.

Run the repository check at any time:

```bash
npm run firebase:phase1:check
```

## Firebase Console checklist

Complete these steps once for each project. Record the chosen region because Firestore and Storage location choices can be difficult or impossible to change later.

### Development — `kallayani-storefront-dev`

- [ ] Confirm the Firebase project exists and has the correct owners.
- [ ] Attach a Blaze billing account before enabling Cloud Storage.
- [ ] Create conservative billing budget alerts. Alerts notify; they do not cap charges.
- [ ] Create a Native-mode Firestore database in the selected region.
- [ ] Create the default Storage bucket in a compatible region.
- [ ] Enable Authentication → Email/Password.
- [ ] Add `localhost` and the approved development preview domains to Authentication authorized domains.
- [ ] Add a Firebase Web app and place its configuration in the untracked `.env.local` file.
- [ ] Deploy the reviewed rules and indexes.

### Staging — `kallayani-storefront-staging`

- [ ] Confirm the Firebase project exists and is separate from development.
- [ ] Attach a Blaze billing account before enabling Cloud Storage.
- [ ] Create conservative billing budget alerts.
- [ ] Create a Native-mode Firestore database in the selected region.
- [ ] Create the default Storage bucket in a compatible region.
- [ ] Enable Authentication → Email/Password.
- [ ] Add only approved staging domains to Authentication authorized domains.
- [ ] Register a separate Firebase Web app and keep its configuration outside source control.
- [ ] Deploy the reviewed rules and indexes.

Google sign-in is deliberately deferred unless the administrator sign-in experience requires it. Production remains deferred until the catalogue workflow has been exercised in staging.

## CLI setup and deployment

Authenticate locally and create the ignored local alias file:

```bash
npx firebase login
cp .firebaserc.example .firebaserc
npx firebase use dev
```

Review the selected project in the command output before any deployment. Then deploy only the Phase 1 resources:

```bash
npm run firebase:deploy:dev
npm run firebase:deploy:staging
```

These commands intentionally do not deploy Hosting, Functions, or application data. They deploy Firestore rules, Firestore indexes, and the closed Storage rules only.

## Verification

Phase 1 is complete when all of the following are true:

1. `npm run firebase:phase1:check` passes.
2. Firebase CLI lists both projects for the authenticated account.
3. The Firebase Console shows a Native-mode Firestore database and default Storage bucket in both projects.
4. Email/Password Authentication is enabled in both projects.
5. The rules and indexes deploy successfully to each explicit project ID.
6. The existing local storefront still passes lint and build checks.

The local CLI is not a substitute for the Console checklist: billing, budget alerts, region choice, provider enablement, and authorized domains are account-level configuration.
