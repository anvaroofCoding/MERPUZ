import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: "https://pprs-7o08.onrender.com/api",
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
    EditRegister: builder.mutation({
      query: ({ id, body }) => ({
        url: `/register/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    register_Detail: builder.query({
      query: (id) => `/register/${id}/`,
      providesTags: ["MainTag"],
    }),
    EditRegisterPhoto: builder.mutation({
      query: ({ id, body }) => ({
        url: `/register/${id}/`,
        method: "PUT",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["MainTag"],
    }),
    aplication: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        tuzilma_nomi = "",
      }) =>
        `/ariza?page=${page}&limit=${limit}&search=${search}&status=${status}&tuzilma_nomi=${tuzilma_nomi}`,
      providesTags: ["MainTag"],
    }),
    AddAplication: builder.mutation({
      query: (body) => ({
        url: "/ariza/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    OptionTuzilma: builder.query({
      query: () => `/tuzilma-nomi/`,
      providesTags: ["MainTag"],
    }),
    OptionAplication: builder.query({
      query: () => `/ariza/`,
      providesTags: ["MainTag"],
    }),
    aplication_details: builder.query({
      query: (id) => `/ariza/${id}/`,
      providesTags: ["MainTag"],
    }),
    EditAplication: builder.mutation({
      query: ({ id, body }) => ({
        url: `/ariza/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    DeleteAplication: builder.mutation({
      query: ({ id }) => ({
        url: `/ariza/${id}/`,
        method: "Delete",
      }),
      invalidatesTags: ["MainTag"],
    }), // Arizani tugatish uchun ishlatiladigan api. Xato yozib yuborsa faqatgina
    DeletePhoto: builder.mutation({
      query: ({ ids }) => ({
        url: `/ariza-image-delete/${ids}/`,
        method: "Delete",
      }),
      invalidatesTags: ["MainTag"],
    }),
    Coming_Aplication: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `/kelgan-arizalar?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["MainTag"],
    }),
    Coming_Application_Detail: builder.query({
      query: (id) => `/kelgan-arizalar/${id}/`,
      providesTags: ["MainTag"],
    }),
    Coming_App_qabul_qilindi: builder.mutation({
      query: (body) => ({
        url: "/kelgan-arizalar-create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
  }),
});

export const {
  useComing_App_qabul_qilindiMutation,
  useComing_Application_DetailQuery,
  useDeletePhotoMutation,
  useComing_AplicationQuery,
  useDeleteAplicationMutation,
  useEditAplicationMutation,
  useAplication_detailsQuery,
  useOptionAplicationQuery,
  useOptionTuzilmaQuery,
  useAddAplicationMutation,
  useAplicationQuery,
  useEditRegisterPhotoMutation,
  useRegister_DetailQuery,
  useEditRegisterMutation,
  useAddRegisterMutation,
  useRegisterQuery,
  useLazyObyektQuery,
  useLoginMutation,
} = api;
