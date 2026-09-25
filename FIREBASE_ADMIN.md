# Firebase Catalogue Administration

The Kallayani admin workspace is available at `/admin`. Its JavaScript is lazy-loaded and it uses Firebase Authentication custom claims plus Firestore and Storage rules for authorization.

## Local development

Run the complete local stack:

```bash
npm run dev
```

This starts:

- Authentication on `127.0.0.1:9099`
- Firestore on `127.0.0.1:8080`
- Storage on `127.0.0.1:9199`
- Emulator UI on `127.0.0.1:4000`
- Vite on `localhost:5173`

Create an Email/Password user in the Authentication emulator, then assign its role while the emulator is running:

```bash
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run firebase:set-role -- staff@example.com admin
```

The command displays the project, UID, and current claims before it asks the operator to type `assign`. The user must sign in again or refresh their token after a role change.

For a cloud project, do not put service-account JSON in the repository. Use Application Default Credentials in a trusted operator environment and run the same command without `FIREBASE_AUTH_EMULATOR_HOST`.

## Roles

- `admin`: manage catalogue documents and media, including permanent document deletion through trusted tooling.
- `manager`: create and update catalogue documents and media, but cannot permanently delete Firestore catalogue documents.
- `customer`: no catalogue administration access.

The interface checks the claim to provide a useful access-denied screen. Firestore and Storage rules independently enforce the same boundary.

The admin bundle uses a separately named Firebase client instance. Its staff session is isolated from the storefront client, so opening a public preview cannot replace staff credentials with an anonymous shopping session.

## Product workflow

1. Create and save a draft. This allocates the Firestore product ID used by Storage paths.
2. Add descriptive content, category, pricing, variants, stock, badges, and SEO fields.
3. Upload JPEG, PNG, or WebP media up to 10 MB with meaningful alt text.
4. Select the primary image.
5. Publish. The client refuses publication until all required catalogue fields are valid and the slug is unique.
6. Unpublish to return a product to draft, or archive it for normal removal. Permanent deletion is intentionally absent from the UI.

Public storefront queries continue to require `status == "published"`. Draft and archived documents therefore remain unavailable to public clients.

## Admin routes

- `/admin`: catalogue counts and workflow overview.
- `/admin/products`: product search, filters, duplication, archive, and editor access.
- `/admin/products/new` and `/admin/products/:id`: product drafting, variants, media, SEO, validation, and publishing.
- `/admin/collections`: collection creation, landing-page copy, ordering, imagery, subcategories, and status.
- `/admin/homepage`: hero banners, category tiles, and editorial-feature content.
- `/admin/media`: searchable referenced-media inventory with Storage-versus-migration status and links back to each product.

Collection and homepage editors update Firestore directly through the claim-protected admin client. Media deletion and replacement remain inside the owning product editor so an asset cannot be detached from its catalogue record accidentally.

## Existing media migration

The migration command is dry-run by default:

```bash
npm run firebase:migrate:media
```

It reports products whose image fields still begin with `/images/`. Apply only after verifying the explicit development or staging project and bucket:

```bash
npm run firebase:migrate:media -- --apply
npm run firebase:verify:media
```

The script uploads each local asset to a UUID-based `catalog/products/{productId}/original/` path, records the Storage path, URL, alt text, and dimensions, and updates Firestore. If the Firestore update fails, newly uploaded objects for that product are removed. It refuses project IDs that do not contain `dev` or `staging`. The media verification command rejects local `/images/` references and requests every migrated Storage URL.

Keep `public/images` as rollback material until every homepage, collection, and product image has been verified in staging. Do not run the catalogue seed against live admin-managed data.

The seed script now refuses every cloud target by default, including the development project. It remains available for emulators. A reviewed recovery operation must deliberately set `ALLOW_CLOUD_SEED=true`; non-development projects additionally retain the `ALLOW_PRODUCTION_SEED=true` safeguard.

## Cloud rollout order

1. Complete the account-level tasks in `FIREBASE_PHASE_1.md`.
2. Deploy Firestore indexes and the new Firestore/Storage rules.
3. Create the first staff account and assign its custom claim from a trusted operator machine.
4. Test draft creation, upload, replacement, publication, unpublication, and archive in staging.
5. Run the media migration dry run, then apply it in staging.
6. Verify no published product image field begins with `/images/`.
7. Only then repeat the reviewed process for a future production project.
