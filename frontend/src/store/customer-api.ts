import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/lib/firebase";
import type { ShopState } from "./store";
import type { CustomerOrder, CustomerProfile, SavedAddress } from "@/types/customer";

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
  tagTypes: ["Commerce", "Profile", "Addresses", "Orders"],
  endpoints: (builder) => ({
    getCommerce: builder.query<ShopState, void>({
      query: () => "/users/me/commerce",
      transformResponse: (response: Envelope<ShopState>) => response.data,
      providesTags: ["Commerce"],
    }),
    saveCommerce: builder.mutation<void, ShopState>({
      query: (body) => ({ url: "/users/me/commerce", method: "PUT", body }),
    }),
    getProfile: builder.query<CustomerProfile | null, void>({
      query: () => "/users/me",
      transformResponse: (response: Envelope<CustomerProfile | null>) => response.data,
      providesTags: ["Profile"],
    }),
    upsertProfile: builder.mutation<CustomerProfile, ProfileInput>({
      query: (body) => ({ url: "/users/me", method: "PUT", body }),
      transformResponse: (response: Envelope<CustomerProfile>) => response.data,
      invalidatesTags: ["Profile"],
    }),
    getAddresses: builder.query<SavedAddress[], void>({
      query: () => "/users/me/addresses",
      transformResponse: (response: Envelope<SavedAddress[]>) => response.data,
      providesTags: ["Addresses"],
    }),
    saveAddresses: builder.mutation<SavedAddress[], SavedAddress[]>({
      query: (addresses) => ({
        url: "/users/me/addresses",
        method: "PUT",
        body: { addresses },
      }),
      transformResponse: (response: Envelope<SavedAddress[]>) => response.data,
      invalidatesTags: ["Addresses"],
    }),
    getOrders: builder.query<CustomerOrder[], void>({
      query: () => "/users/me/orders",
      transformResponse: (response: Envelope<CustomerOrder[]>) => response.data,
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<CustomerOrder, string>({
      query: (orderId) => `/users/me/orders/${encodeURIComponent(orderId)}`,
      transformResponse: (response: Envelope<CustomerOrder>) => response.data,
      providesTags: (_result, _error, orderId) => [{ type: "Orders", id: orderId }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpsertProfileMutation,
  useGetAddressesQuery,
  useSaveAddressesMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
} = customerApi;
