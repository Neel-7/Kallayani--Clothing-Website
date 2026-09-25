import type { StorefrontRepository } from "./storefront-repository";
import { firestoreStorefrontRepository } from "./firestore-storefront-repository";

const provider = import.meta.env.VITE_DATA_PROVIDER ?? "firestore";

if (provider !== "firestore") {
  throw new Error(`Unsupported data provider: ${provider}`);
}

export const storefrontRepository: StorefrontRepository = firestoreStorefrontRepository;
