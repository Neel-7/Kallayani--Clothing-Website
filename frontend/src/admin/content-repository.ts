import { adminApi } from "@/store/admin-api";
import { apiErrorMessage } from "@/store/api-error";
import { store } from "@/store/store";
import type { AdminCollectionDocument, HomepageContentEntry } from "@/types/admin";

async function result<T>(promise: { unwrap(): Promise<T> }, fallback: string) {
  try {
    return await promise.unwrap();
  } catch (reason) {
    throw new Error(apiErrorMessage(reason, fallback));
  }
}

export async function listAdminCollectionDocuments() {
  return result(
    store.dispatch(adminApi.endpoints.listCollections.initiate(undefined, { subscribe: false, forceRefetch: true })),
    "Collections could not be loaded.",
  );
}

export async function createAdminCollection(slug: string, name: string) {
  return result(
    store.dispatch(adminApi.endpoints.createCollection.initiate({ slug, name })),
    "The collection could not be created.",
  );
}

export async function saveAdminCollection(input: AdminCollectionDocument) {
  await result(
    store.dispatch(adminApi.endpoints.updateCollection.initiate(input)),
    "The collection could not be saved.",
  );
}

export async function listHomepageContent() {
  return result(
    store.dispatch(adminApi.endpoints.listHomepage.initiate(undefined, { subscribe: false, forceRefetch: true })),
    "Homepage content could not be loaded.",
  );
}

export async function saveHomepageContent(input: HomepageContentEntry) {
  await result(
    store.dispatch(adminApi.endpoints.updateHomepage.initiate(input)),
    "Homepage content could not be saved.",
  );
}

export type {
  AdminCollectionDocument,
  HomepageContentEntry,
  HomepageContentKind,
} from "@/types/admin";
