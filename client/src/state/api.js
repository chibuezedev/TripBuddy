import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = getState().auth.token;

      // If we have a token set in state
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["User"],
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    signup: build.mutation({
      query: (user) => ({
        url: "auth/signup",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    getProfile: build.query({
      query: () => "auth/profile",
      providesTags: ["User"],
    }),
    postAiText: build.mutation({
      query: (payload) => ({
        url: "openai/text",
        method: "POST",
        body: payload,
      }),
    }),
    postAiCode: build.mutation({
      query: (payload) => ({
        url: "openai/code",
        method: "POST",
        body: payload,
      }),
    }),
    postAiAssist: build.mutation({
      query: (payload) => ({
        url: "openai/assist",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
  usePostAiTextMutation,
  usePostAiCodeMutation,
  usePostAiAssistMutation,
} = api;
