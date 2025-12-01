import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://88.88.150.151:8090/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 403) {
    window.location.pathname = "/no-token-and-go-login";
  }
  return result;
};
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["MainTag"],
  endpoints: (builder) => ({
    obyekt: builder.query({
      query: () => "/obyekt/",
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/token/",
        method: "POST",
        body,
      }),
    }),
    register: builder.query({
      query: () => "/register/",
      providesTags: ["MainTag"],
    }),
    AddRegister: builder.mutation({
      query: (body) => ({
        url: "/register/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    // updateItem: builder.mutation({
    //   query: ({ id, body }) => ({
    //     url: `items/${id}`,
    //     method: "PUT",
    //     body,
    //   }),
    // }),
    // deleteItem: builder.mutation({
    //   query: (id) => ({
    //     url: `items/${id}`,
    //     method: "DELETE", invalidatesTags: ["MainTag"],
    //   }),
    // }),
  }),
});

export const {
  useAddRegisterMutation,
  useRegisterQuery,
  useLazyObyektQuery,
  useLoginMutation,
} = api;
