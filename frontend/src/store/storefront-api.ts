import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Collection, HomePageData, ProductPageData, StorefrontInfo } from "@/types/catalog";

type ApiEnvelope<T> = { data: T };

export const storefrontApi = createApi({
  reducerPath: "storefrontApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1" }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getHomePage: builder.query<HomePageData, void>({
      query: () => "/storefront/home",
      transformResponse: (response: ApiEnvelope<HomePageData>) => response.data,
    }),
    getCollections: builder.query<Collection[], void>({
      query: () => "/storefront/collections",
      transformResponse: (response: ApiEnvelope<Collection[]>) => response.data,
    }),
    getCollection: builder.query<Collection | null, string>({
      query: (slug) => `/storefront/collections/${encodeURIComponent(slug)}`,
      transformResponse: (response: ApiEnvelope<Collection | null>) => response.data,
    }),
    getProduct: builder.query<ProductPageData | null, string>({
      query: (id) => `/storefront/products/${encodeURIComponent(id)}`,
      transformResponse: (response: ApiEnvelope<ProductPageData | null>) => response.data,
    }),
    getStorefrontInfo: builder.query<StorefrontInfo | null, void>({
      query: () => "/storefront/store",
      transformResponse: (response: ApiEnvelope<StorefrontInfo | null>) => response.data,
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
