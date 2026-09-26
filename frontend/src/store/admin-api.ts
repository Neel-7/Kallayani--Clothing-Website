import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminAuth } from "@/lib/firebase-admin-client";
import type {
  AdminCollectionDocument,
  CreateHomepageEntryInput,
  EditableProduct,
  HomepageContentEntry,
  HomepageContentKind,
  ProductDocument,
  ProductImage,
} from "@/types/admin";

type Envelope<T> = { data: T };

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1",
    prepareHeaders: async (headers) => {
      const token = await adminAuth.currentUser?.getIdToken();
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Products", "Collections", "Homepage"],
  endpoints: (builder) => ({
    listProducts: builder.query<ProductDocument[], void>({
      query: () => "/admin/products",
      transformResponse: (response: Envelope<ProductDocument[]>) => response.data,
      providesTags: ["Products"],
    }),
    getProduct: builder.query<ProductDocument, string>({
      query: (id) => `/admin/products/${encodeURIComponent(id)}`,
      transformResponse: (response: Envelope<ProductDocument>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),
    createProduct: builder.mutation<string, EditableProduct>({
      query: (body) => ({ url: "/admin/products", method: "POST", body }),
      transformResponse: (response: Envelope<{ id: string }>) => response.data.id,
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<void, { id: string; product: EditableProduct }>({
      query: ({ id, product }) => ({ url: `/admin/products/${encodeURIComponent(id)}`, method: "PUT", body: product }),
      invalidatesTags: (_result, _error, { id }) => ["Products", { type: "Products", id }],
    }),
    updateProductMedia: builder.mutation<void, { id: string; primaryImage: ProductImage | null; gallery: ProductImage[] }>({
      query: ({ id, ...body }) => ({ url: `/admin/products/${encodeURIComponent(id)}/media`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => ["Products", { type: "Products", id }],
    }),
    setProductStatus: builder.mutation<void, { id: string; status: ProductDocument["status"] }>({
      query: ({ id, status }) => ({ url: `/admin/products/${encodeURIComponent(id)}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: (_result, _error, { id }) => ["Products", { type: "Products", id }],
    }),
    duplicateProduct: builder.mutation<string, string>({
      query: (id) => ({ url: `/admin/products/${encodeURIComponent(id)}/duplicate`, method: "POST" }),
      transformResponse: (response: Envelope<{ id: string }>) => response.data.id,
      invalidatesTags: ["Products"],
    }),
    slugExists: builder.query<boolean, { slug: string; exceptId?: string }>({
      query: ({ slug, exceptId }) => ({ url: "/admin/products/slug-exists", params: { slug, ...(exceptId ? { exceptId } : {}) } }),
      transformResponse: (response: Envelope<{ exists: boolean }>) => response.data.exists,
    }),
    uploadImage: builder.mutation<ProductImage, { id: string; file: File; alt: string }>({
      query: ({ id, file, alt }) => {
        const body = new FormData();
        body.append("image", file);
        body.append("alt", alt);
        return { url: `/admin/products/${encodeURIComponent(id)}/images`, method: "POST", body };
      },
      transformResponse: (response: Envelope<ProductImage>) => response.data,
    }),
    deleteImage: builder.mutation<void, { id: string; paths: string[] }>({
      query: ({ id, paths }) => ({ url: `/admin/products/${encodeURIComponent(id)}/images`, method: "DELETE", body: { paths } }),
    }),
    listCollections: builder.query<AdminCollectionDocument[], void>({
      query: () => "/admin/collections",
      transformResponse: (response: Envelope<AdminCollectionDocument[]>) => response.data,
      providesTags: ["Collections"],
    }),
    createCollection: builder.mutation<string, { slug: string; name: string }>({
      query: (body) => ({ url: "/admin/collections", method: "POST", body }),
      transformResponse: (response: Envelope<{ id: string }>) => response.data.id,
      invalidatesTags: ["Collections"],
    }),
    updateCollection: builder.mutation<void, AdminCollectionDocument>({
      query: (body) => ({ url: `/admin/collections/${encodeURIComponent(body.id)}`, method: "PUT", body }),
      invalidatesTags: ["Collections"],
    }),
    listHomepage: builder.query<HomepageContentEntry[], void>({
      query: () => "/admin/homepage",
      transformResponse: (response: Envelope<HomepageContentEntry[]>) => response.data,
      providesTags: ["Homepage"],
    }),
    createHomepage: builder.mutation<string, CreateHomepageEntryInput>({
      query: (body) => ({ url: "/admin/homepage", method: "POST", body }),
      transformResponse: (response: Envelope<{ id: string }>) => response.data.id,
      invalidatesTags: ["Homepage"],
    }),
    updateHomepage: builder.mutation<void, HomepageContentEntry>({
      query: (body) => ({ url: `/admin/homepage/${body.kind}/${encodeURIComponent(body.id)}`, method: "PUT", body }),
      invalidatesTags: ["Homepage"],
    }),
    deleteHomepage: builder.mutation<void, { kind: HomepageContentKind; id: string }>({
      query: ({ kind, id }) => ({
        url: `/admin/homepage/${kind}/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Homepage"],
    }),
  }),
});
