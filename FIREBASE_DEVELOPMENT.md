# Kallayani Firebase Development Architecture

This document describes how the Kallayani storefront currently loads catalogue data and images, how the local Firebase environment differs from the cloud Firebase project, and what must happen before a production deployment. The environment-stabilization checklist and deploy commands are maintained in [`FIREBASE_PHASE_1.md`](./FIREBASE_PHASE_1.md).

## Current architecture

Kallayani currently uses three separate layers:

1. **Firestore stores content metadata.** Product names, prices, collection relationships, availability, display order, image paths, banners, categories, and editorial content are Firestore document fields.
2. **The repository stores image files.** Images remain under `public/images/` and are served by Vite during development or by the deployed web host in production.
3. **React renders the storefront.** The frontend requests documents through the Firebase Web SDK, maps those documents to the existing catalogue types, and gives each image path to the browser.

Firestore does not currently contain image binary data, and Firebase Storage is not currently used by the application. A deny-by-default Storage ruleset is registered as the secure Phase 1 baseline.

```text
Firestore document                    Website host
------------------                    ------------
title: "Rakta Jamdani saree"          /images/women/product-rakta.webp
priceFrom: 248                                |
primaryImageUrl: "/images/women/..."          |
             |                                |
             +------------ React ------------+
                              |
                         rendered product
```

## How an image is rendered

The current image flow is:

1. An image exists in the repository, for example `public/images/women/product-rakta.webp`.
2. `src/data/catalog.ts` associates that path with the product.
3. `scripts/seed-firestore.ts` writes the string `/images/women/product-rakta.webp` to the product document's `primaryImageUrl` field.
4. `src/data/firestore-storefront-repository.ts` reads the product document and maps `primaryImageUrl` to the frontend product model.
5. A React component uses that value as the `<img src>`.
6. The browser requests the actual file from the website server, not from Firestore.

During local development, the resulting image request resembles:

```text
http://localhost:5173/images/women/product-rakta.webp
```

After deployment, Vite copies `public/images/` into `dist/images/`. The production request will resemble:

```text
https://your-domain.com/images/women/product-rakta.webp
```

The images are therefore deployment assets. They are not loaded from a developer's computer after the site has been deployed.

## Local Firebase development

Run the complete local environment with:

```bash
npm run dev
```

This command performs the complete startup sequence:

1. Starts the local Firestore emulator on `127.0.0.1:8080`.
2. Starts the local Authentication emulator on `127.0.0.1:9099`.
3. Seeds the local Firestore emulator with the current catalogue.
4. Starts Vite at `http://localhost:5173`.

The Emulator Suite interface is available at:

```text
http://127.0.0.1:4000
```

The seed is repeatable and currently creates:

- 41 products
- 6 collections
- 4 homepage banners
- 8 homepage categories
- 3 editorial features
- Store-level content and seed metadata

Stop the local stack with `Ctrl+C`. Emulator data should be treated as temporary; `npm run dev` restores the catalogue the next time the stack starts.

## Why the Firebase Console remains empty

The local Firebase emulator and Google Cloud Firestore are separate databases.

Although `.env.local` identifies `kallayani-storefront-dev`, the `npm run dev` orchestrator sets `VITE_USE_FIREBASE_EMULATORS=true` for the Vite process. The Firebase Web SDK consequently connects to `127.0.0.1` instead of sending reads and writes to Google's servers.

The project ID gives the local emulator the correct project namespace; it does not upload emulator documents to the cloud project. Therefore, documents visible at `http://127.0.0.1:4000/firestore` will not appear in the Firebase Console.

## Cloud/live mode

The live-only frontend command is:

```bash
npm run dev:live
```

Do not use this command as the normal development workflow until the cloud project has been prepared. The current cloud project may display the storefront error state because it has not yet received the catalogue documents, security rules, indexes, and Authentication configuration.

Before live mode or production deployment, complete all of the following:

1. Authenticate the Firebase CLI with an account that can access `kallayani-storefront-dev`.
2. Create or confirm the Cloud Firestore database.
3. Review and deploy `firestore.rules`.
4. Review and deploy `firestore.indexes.json`.
5. Enable the required Firebase Authentication providers.
6. Seed the live development project using authorized Firebase Admin credentials.
7. Run the verification script against the live project.
8. Build and test the production bundle.

Never point the seed script at a production customer database without reviewing its target and data. The script contains a development-project safeguard, but the operator remains responsible for verifying the selected Firebase project.

## Data ownership and source of truth

At this stage, the repository's catalogue modules remain the seed source:

- `src/data/catalog.ts`
- `src/data/home-seed.ts`
- `src/components/product/product-config.ts`

The seed script converts this source data into the Firestore document structure. After seeding, storefront pages read from Firestore rather than importing those modules directly.

This is an intentional migration stage: it allows the existing UI and assets to remain unchanged while the data-access layer moves to Firebase. Once an administration workflow exists, Firestore can become the primary source of truth and the repository seed can be retained only for fixtures, testing, and disaster recovery.

## Firestore collections

The current public catalogue uses these top-level collections:

| Collection          | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `products`          | Product details, prices, variants, availability, and image paths       |
| `collections`       | Collection landing-page content and subcategories                      |
| `banners`           | Homepage hero campaigns                                                |
| `homeCategories`    | Homepage category tiles                                                |
| `editorialFeatures` | Homepage editorial panels                                              |
| `siteContent`       | Store-wide content such as announcements and footer information        |
| `system`            | Seed/schema metadata used for verification                             |
| `users`             | Per-user data, including synchronized cart and wishlist subcollections |

Public catalogue reads are controlled by `firestore.rules`. Client-side catalogue writes are denied. User documents are restricted to the authenticated user ID.

## Authentication, cart, and wishlist

Firebase Authentication is used for account registration and sign-in. During local development, those accounts exist only inside the Authentication emulator.

The storefront can establish an anonymous Firebase session for shopping state. Cart and wishlist changes are stored beneath the corresponding user's Firestore document. A registered user must only be allowed to read or write their own documents; this boundary is enforced by Firestore security rules, not merely by the React interface.

## Environment files and repository hygiene

Create `.env.local` from `.env.example` and provide the Firebase Web configuration there. `.env.local`, Firebase CLI state, emulator logs, exports, service-account files, build output, dependencies, and editor files are excluded by `.gitignore`.

Firebase Web configuration values are identifiers used by the browser and are not a replacement for security rules. Even so, environment-specific values should remain out of the repository so each environment can be configured independently. Private service-account keys and Admin credentials must never be placed in a `VITE_` variable, browser bundle, or Git commit.

Files intended for version control include:

- `.env.example` with empty values
- `.firebaserc.example`
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- Firebase integration and seed scripts
- This architecture document

## Moving images to Firebase Storage later

Keeping images in `public/images/` is suitable while the catalogue is maintained through code and deployed as a single storefront build. Move images to Firebase Storage when non-developers need to add or replace product media without deploying the frontend.

A future Storage-based flow would be:

```text
Admin uploads image
        |
        v
Firebase Storage: products/rakta-jamdani/main.webp
        |
        v
Firestore primaryImageUrl: https://firebasestorage.googleapis.com/...
        |
        v
React renders the remote Storage URL
```

That migration will require Storage security rules, upload validation, image-size limits, naming conventions, deletion handling, and an administration interface. It is not necessary for the current frontend integration.

## Useful commands

```bash
# Local emulators + seed + storefront
npm run dev

# Frontend connected to the cloud configuration
npm run dev:live

# Start only the Firebase emulators
npm run firebase:emulators

# Seed the selected target (uses .env.local)
npm run firebase:seed

# Preview the documents without writing
npm run firebase:seed:dry

# Verify catalogue structure and image paths
npm run firebase:verify

# Verify repository-side Phase 1 configuration
npm run firebase:phase1:check

# Deploy Phase 1 rules and indexes to an explicit environment
npm run firebase:deploy:dev
npm run firebase:deploy:staging

# Validate the application
npm run lint
npm run build
```

When using `firebase:seed` or `firebase:verify` manually, always confirm whether `FIRESTORE_EMULATOR_HOST` is set. If it is set, the command targets the emulator. If it is absent, Firebase Admin attempts to use cloud credentials and the configured cloud project.

## Troubleshooting

### "The collection is resting"

This means a Firestore-backed query failed. Common causes are:

- the local emulator is not running;
- the frontend was started with `npm run dev:live` against an empty cloud project;
- Firestore security rules have not been deployed;
- the selected Firebase project is incorrect;
- the catalogue has not been seeded;
- a required Firestore index is missing.

For ordinary local work, stop old Vite/Firebase processes and run `npm run dev` from the project root.

### Firebase Console has no documents

This is expected when using the local emulator. Inspect local documents in the Emulator Suite UI. Preparing the cloud project is a separate, deliberate deployment operation.

### Images return 404

Confirm that the Firestore image field starts with `/images/` and that the corresponding file exists under `public/images/`. Path capitalization matters on Linux deployment hosts.
