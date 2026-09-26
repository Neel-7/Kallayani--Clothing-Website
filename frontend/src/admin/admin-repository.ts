import { store } from "@/store/store";
import { adminApi } from "@/store/admin-api";
import { apiErrorMessage } from "@/store/api-error";
import type {
  AdminCollectionOption,
  CatalogStatus,
  EditableProduct,
  ProductDocument,
  ProductImage,
} from "@/types/admin";

async function queryResult<T>(promise: { unwrap(): Promise<T> }, fallback: string) {
  try {
    return await promise.unwrap();
  } catch (reason) {
    throw new Error(apiErrorMessage(reason, fallback));
  }
}

export async function listAdminProducts() {
  return queryResult(
    store.dispatch(adminApi.endpoints.listProducts.initiate(undefined, { subscribe: false, forceRefetch: true })),
    "Products could not be loaded.",
  );
}

export async function getAdminProduct(productId: string): Promise<ProductDocument | null> {
  try {
    return await queryResult(
      store.dispatch(adminApi.endpoints.getProduct.initiate(productId, { subscribe: false, forceRefetch: true })),
      "The product could not be loaded.",
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found.") return null;
    throw error;
  }
}

export async function listAdminCollections(): Promise<AdminCollectionOption[]> {
  const collections = await queryResult(
    store.dispatch(adminApi.endpoints.listCollections.initiate(undefined, { subscribe: false, forceRefetch: true })),
    "Collections could not be loaded.",
  );
  return collections
    .map(({ slug, name }) => ({ slug, name }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function createProductDraft(input: EditableProduct) {
  return queryResult(
    store.dispatch(adminApi.endpoints.createProduct.initiate(input)),
    "The product draft could not be created.",
  );
}

export async function saveAdminProduct(productId: string, input: EditableProduct) {
  await queryResult(
    store.dispatch(adminApi.endpoints.updateProduct.initiate({ id: productId, product: input })),
    "The product could not be saved.",
  );
}

export async function saveProductMedia(
  productId: string,
  primaryImage: ProductImage | null,
  gallery: ProductImage[],
) {
  await queryResult(
    store.dispatch(adminApi.endpoints.updateProductMedia.initiate({ id: productId, primaryImage, gallery })),
    "The product media could not be saved.",
  );
}

export async function setProductStatus(productId: string, status: CatalogStatus) {
  await queryResult(
    store.dispatch(adminApi.endpoints.setProductStatus.initiate({ id: productId, status })),
    "The product status could not be changed.",
  );
}

export async function duplicateProduct(productId: string) {
  return queryResult(
    store.dispatch(adminApi.endpoints.duplicateProduct.initiate(productId)),
    "The product could not be duplicated.",
  );
}

export async function productSlugExists(slug: string, exceptId?: string) {
  return queryResult(
    store.dispatch(
      adminApi.endpoints.slugExists.initiate(
        { slug, exceptId },
        { subscribe: false, forceRefetch: true },
      ),
    ),
    "The product slug could not be checked.",
  );
}

export type { AdminCollectionOption } from "@/types/admin";
