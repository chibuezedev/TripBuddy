import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  reducerPath: "main",
  tagTypes: ["User"],
  endpoints: (build) => ({
    postAiText: build.mutation({
      query: (payload) => ({
        url: "openai/text",
        method: "POST",
        body: payload,
      }),
    }),
    postTripBuddyAi: build.mutation({
      query: (payload) => ({
        url: "openai/suggestion",
        method: "POST",
        body: payload,
      }),
    }),
    postAiAssistant: build.mutation({
      query: (payload) => ({
        url: "openai/assist",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  usePostAiTextMutation,
  usePostTripBuddyAiMutation,
  usePostAiAssistantMutation,
} = api;
