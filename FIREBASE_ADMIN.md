# Catalogue administration

The admin workspace is at `/admin`. Firebase Authentication provides the staff identity; Express verifies the ID token and requires an `admin` or `manager` custom claim on every admin API request.

## Local staff setup

Start the emulators, create an Email/Password user in the Emulator UI, then run:

```bash
npm run firebase:set-role --workspace backend -- staff@example.com admin
```

Type `assign` after checking the displayed project and UID. Sign in again so Firebase issues a token containing the new role.

## Product workflow

1. Create a draft and save it to allocate a product ID.
2. Add copy, collection, price, variants, stock, merchandising, and SEO fields.
3. Upload a JPEG, PNG, or WebP image up to 10 MB with useful alt text.
4. Express validates the file and Sharp creates an optimized WebP original plus thumbnail.
5. Express stores both renditions under `catalog/products/{productId}/...` in Firebase Storage.
6. Select the primary image and publish. Both client and server validate publication requirements.
7. Unpublish or archive instead of permanently deleting normal catalogue data.

Public storefront endpoints return only published products and collections. Draft and archived records remain available only to staff.

## Admin capabilities

- Dashboard and catalogue counts
- Product create, edit, duplicate, publish, unpublish, and archive
- Variants, stock, prices, badges, SEO, and media metadata
- Collection copy, imagery, position, and publishing
- Homepage banners, category tiles, and editorial content
- Searchable media inventory

## Existing image migration

The migration command is a dry run by default and is restricted to development or staging project IDs:

```bash
npm run firebase:migrate:media --workspace backend
npm run firebase:migrate:media --workspace backend -- --apply
npm run firebase:verify:media --workspace backend
```

Keep `frontend/public/images/` until staging confirms all migrated media. Normal admin uploads already use Firebase Storage and do not write into the repository.

## Production credentials

Use Application Default Credentials in the deployment platform, or inject single-line service-account JSON through `FIREBASE_SERVICE_ACCOUNT_JSON`. The credential belongs only to the backend. Configure `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FRONTEND_ORIGIN`, and `NODE_ENV=production` in the backend runtime.
