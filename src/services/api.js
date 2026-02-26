import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://88.88.150.151:9000/api",
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
  if (result?.error?.status === 401) {
    const currentPath = window.location.pathname;
    // Login sahifasining o'zida bo'lsa redirect qilmaymiz
    if (currentPath !== "/no-token-and-go-login") {
      window.location.replace("/no-token-and-go-login");
    }
  }
  if (result?.error?.status === 500) {
    window.location.pathname = "/Error-500";
  }
  if (result?.error?.status === 403) {
    window.location.pathname = "/Error-401";
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
      query: ({ page, limit, search }) => ({
        url: "register/",
        params: {
          page,
          limit,
          search: search || undefined,
        },
      }),
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
      query: ({ body }) => ({
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
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        tuzilma_nomi = "",
      }) =>
        `/kelgan-arizalar?page=${page}&limit=${limit}&search=${search}&status=${status}&tuzilma_nomi=${tuzilma_nomi}`,
      providesTags: ["MainTag"],
    }),
    Coming_Application_Detail: builder.query({
      query: (id) => `/kelgan-arizalar/${id}/`,
      providesTags: ["MainTag"],
    }),
    Coming_App_qabul_qilindi: builder.mutation({
      query: ({ body }) => ({
        url: "/kelgan-arizalar/status_ozgartirish/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    Coming_App_Done: builder.mutation({
      query: ({ body }) => ({
        url: "/kelgan-arizalar-create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    Created_PPR: builder.query({
      query: () => `/ppr-turi`,
      providesTags: ["MainTag"],
    }),
    Created_PPR_Post: builder.mutation({
      query: ({ body }) => ({
        url: "/ppr-turi/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    Created_PPR_Edit: builder.mutation({
      query: ({ body, id }) => ({
        url: `/ppr-turi/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    Obyekt: builder.query({
      query: ({ search }) => ({
        url: `/obyekt/?search=${search}`,
      }),
      providesTags: ["MainTag"],
    }),
    Obyekt_post: builder.mutation({
      query: ({ body }) => ({
        url: "/obyekt/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    ObyektPostLocations: builder.mutation({
      query: ({ body }) => ({
        url: "/obyekt-locations/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    EditObyektlar: builder.mutation({
      query: ({ body, id }) => ({
        url: `/obyekt-locations/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    ME: builder.query({
      query: () => "/me/",
      providesTags: ["MainTag"],
    }),
    PprMonth: builder.query({
      query: ({ bolim_category }) =>
        `/ppr-jadval/?bolim_category=${bolim_category}`,
      providesTags: ["MainTag"],
    }),
    AddPPRJadval: builder.mutation({
      query: ({ body }) => ({
        url: "/ppr-jadval/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    PprMonthDetails: builder.query({
      query: (id) => `/ppr-jadval/${id}/`,
      providesTags: ["MainTag"],
    }),
    EditPPRMOnth: builder.mutation({
      query: ({ body, id }) => ({
        url: `/ppr-jadval/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    deletePPRMonth: builder.mutation({
      query: (id) => ({
        url: `/ppr-jadval/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["MainTag"],
    }),
    addBolum: builder.mutation({
      query: ({ body }) => ({
        url: "/bolimlar/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    editBolum: builder.mutation({
      query: ({ body, id }) => ({
        url: `/bolimlar/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    Tarkibiy: builder.query({
      query: () => "/tuzilma-nomi/",
      providesTags: ["MainTag"],
    }),
    AddRegister2: builder.mutation({
      query: ({ body }) => ({
        url: "/register/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    aplication2: builder.query({
      query: ({ search = "", status = "" }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (status && status !== "all") params.append("status", status);

        return `/ariza?${params.toString()}`;
      },
      providesTags: ["MainTag"],
    }),

    AddAplicationsSteps: builder.mutation({
      query: ({ body, id }) => ({
        url: `/ariza/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    DeleteAplicationsSteps: builder.mutation({
      query: ({ id }) => ({
        url: `/ariza/${id}/`,
        method: "Delete",
      }),
      invalidatesTags: ["MainTag"],
    }),
    // kelgan arizalarni statusini o'zgartirish
    ChangeComingAplication: builder.mutation({
      query: ({ body }) => ({
        url: `/ariza-status/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    Comingaplication2: builder.query({
      query: ({ search = "", status = "" }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (status && status !== "all") params.append("status", status);

        return `/kelgan-arizalar?${params.toString()}`;
      },
      providesTags: ["MainTag"],
    }),
    // Dashboards
    dashbaordsCharter: builder.query({
      query: () => "/chart-statistics/",
      providesTags: ["MainTag"],
    }),

    pprYears: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "all",
        yil = "",
        oy = "",
      }) => {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", limit);

        if (search) params.append("search", search);
        if (yil) params.append("yil", yil);
        if (oy) params.append("oy", oy);

        // 🔥 ENG MUHIM QISM
        if (status && status !== "all") {
          params.append("status", status);
        }

        return `/ppr-yillik?${params.toString()}`;
      },
      providesTags: ["MainTag"],
    }),

    obyektOption: builder.query({
      query: () => "/obyekt/",
      providesTags: ["MainTag"],
    }),
    pprTuriOption: builder.query({
      query: () => "/ppr-turi/",
      providesTags: ["MainTag"],
    }),
    addPPRYears: builder.mutation({
      query: ({ body }) => ({
        url: `/ppr-yillik/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    IjroTime: builder.mutation({
      query: ({ id, body }) => ({
        url: `/ariza/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    BolimName: builder.query({
      query: () => "/bolim-category/",
      providesTags: ["MainTag"],
    }),
    addBolimName: builder.mutation({
      query: ({ body }) => ({
        url: `/bolim-category/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    editBolimName: builder.mutation({
      query: ({ body, id }) => ({
        url: `/bolim-category/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    PPRtastiqlashGet: builder.query({
      query: ({
        status = "",
        search = "",
        limit = 10,
        page = 1,
        bolim_category__nomi = "",
      }) =>
        `/yuborish-status/?status=${status}&search=${search}&limit=${limit}&page=${page}&bolim_category__nomi=${bolim_category__nomi}`,
      providesTags: ["MainTag"],
    }),
    PPRtastiqlashPOSt: builder.mutation({
      query: ({ body }) => ({
        url: `/ppr-tasdiqlash/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    pprYuborish: builder.mutation({
      query: ({ body, id }) => ({
        url: `/ppr-yuborish/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    PPrniJonatishPost: builder.mutation({
      query: (body) => ({
        url: `/ppr-yuborish/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MainTag"],
    }),
    PPRtastiqlashGetForFind: builder.query({
      query: () => `/yuborish-status/`,
      providesTags: ["MainTag"],
    }),
    pprJarayondaForFinding: builder.query({
      query: () => "/ppr-jarayonda/",
      providesTags: ["MainTag"],
    }),
    PPRbajarildiPOST: builder.mutation({
      query: (formData) => ({
        url: `/ppr-bajarildi/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["MainTag"],
    }),
    Notifications: builder.query({
      query: ({ search = "", limit = 10, page = 1 }) =>
        `/notifications/?search=${search}&limit=${limit}&page=${page}`,
      providesTags: ["MainTag"],
    }),
    NotificationsView: builder.query({
      query: ({ id }) => `/notifications/${id}`,
      providesTags: ["MainTag"],
    }),
  }),
});
export const {
  useNotificationsViewQuery,
  useNotificationsQuery,
  usePPRbajarildiPOSTMutation,
  usePprJarayondaForFindingQuery,
  usePPRtastiqlashGetForFindQuery,
  usePPrniJonatishPostMutation,
  usePprYuborishMutation,
  usePPRtastiqlashPOStMutation,
  usePPRtastiqlashGetQuery,
  useAddBolimNameMutation,
  useEditBolimNameMutation,
  useBolimNameQuery,
  useIjroTimeMutation,
  useAddPPRYearsMutation,
  useObyektOptionQuery,
  usePprTuriOptionQuery,
  usePprYearsQuery,
  useDashbaordsCharterQuery,
  useComingaplication2Query,
  useChangeComingAplicationMutation,
  useDeleteAplicationsStepsMutation,
  useAddAplicationsStepsMutation,
  useAplication2Query,
  useAddRegister2Mutation,
  useTarkibiyQuery,
  useEditBolumMutation,
  useAddBolumMutation,
  useDeletePPRMonthMutation,
  useEditPPRMOnthMutation,
  usePprMonthDetailsQuery,
  useAddPPRJadvalMutation,
  usePprMonthQuery,
  useMEQuery,
  useEditObyektlarMutation,
  useObyektPostLocationsMutation,
  useObyekt_postMutation,
  useObyektQuery,
  useCreated_PPR_EditMutation,
  useCreated_PPR_PostMutation,
  useCreated_PPRQuery,
  useComing_App_DoneMutation,
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
