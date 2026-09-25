import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { storefrontRepository } from "@/data/repository";
import type { Collection, HomePageData, ProductPageData, StorefrontInfo } from "@/types/catalog";

type StorefrontApiError = { message: string };

async function resolveQuery<T>(operation: () => Promise<T>) {
  try {
    return { data: await operation() };
  } catch (error) {
    if (import.meta.env.DEV) console.error("Storefront data request failed.", error);
    return {
      error: {
        message: error instanceof Error ? error.message : "The storefront request failed.",
      },
    };
  }
}

export const storefrontApi = createApi({
  reducerPath: "storefrontApi",
  baseQuery: fakeBaseQuery<StorefrontApiError>(),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getHomePage: builder.query<HomePageData, void>({
      queryFn: () => resolveQuery(() => storefrontRepository.getHomePage()),
    }),
    getCollections: builder.query<Collection[], void>({
      queryFn: () => resolveQuery(() => storefrontRepository.getCollections()),
    }),
    getCollection: builder.query<Collection | null, string>({
      queryFn: (slug) => resolveQuery(() => storefrontRepository.getCollection(slug)),
    }),
    getProduct: builder.query<ProductPageData | null, string>({
      queryFn: (productId) => resolveQuery(() => storefrontRepository.getProduct(productId)),
    }),
    getStorefrontInfo: builder.query<StorefrontInfo | null, void>({
      queryFn: () => resolveQuery(() => storefrontRepository.getStorefrontInfo()),
    }),
  }),
});

export const {
  useGetHomePageQuery,
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useGetProductQuery,
  useGetStorefrontInfoQuery,
} = storefrontApi;
