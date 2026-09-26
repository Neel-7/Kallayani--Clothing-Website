import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/lib/firebase";
import type { ShopState } from "./store";

type Envelope<T> = { data: T };
export type ProfileInput = { firstName: string; lastName: string; marketingOptIn: boolean };

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1",
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser?.getIdToken();
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Commerce", "Profile"],
  endpoints: (builder) => ({
    getCommerce: builder.query<ShopState, void>({
      query: () => "/users/me/commerce",
      transformResponse: (response: Envelope<ShopState>) => response.data,
      providesTags: ["Commerce"],
    }),
    saveCommerce: builder.mutation<void, ShopState>({
      query: (body) => ({ url: "/users/me/commerce", method: "PUT", body }),
    }),
    upsertProfile: builder.mutation<unknown, ProfileInput>({
      query: (body) => ({ url: "/users/me", method: "PUT", body }),
      transformResponse: (response: Envelope<unknown>) => response.data,
      invalidatesTags: ["Profile"],
    }),
  }),
});
