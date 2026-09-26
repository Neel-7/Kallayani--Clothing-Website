# Kallayani API

The API is organized by responsibility:

- `config/` validates runtime configuration and initializes Firebase Admin.
- `middleware/` verifies Firebase tokens, enforces staff roles, validates requests, and normalizes errors.
- `routes/` defines the versioned HTTP contract.
- `schemas/` contains Zod request schemas.
- `services/` contains catalogue, content, media, customer, and order business logic.

Public storefront reads are under `/api/v1/storefront`. Customer endpoints under `/api/v1/users` require any valid Firebase user. `/api/v1/admin` requires an `admin` or `manager` custom claim.

Product uploads accept JPEG, PNG, or WebP files up to 10 MB. The API creates an optimized WebP original and thumbnail, stores both in Firebase Storage, and returns their durable paths and download-token URLs for Firestore metadata.
