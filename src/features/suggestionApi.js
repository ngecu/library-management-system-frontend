import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const base_url = `${host}/suggestions`;

export const suggestionApi = createApi({
  reducerPath: 'suggestionApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['suggestions'],
  endpoints: (builder) => ({
    // Submit a new suggestion
    submitSuggestion: builder.mutation({
      query: (newSuggestion) => ({
        url: '/',
        method: 'POST',
        body: newSuggestion,
      }),
      invalidatesTags: ['suggestions'],
    }),

    // Fetch all suggestions
    fetchSuggestions: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      providesTags: ['suggestions'],
    }),

    // Fetch a suggestion by ID
    fetchSuggestionById: builder.query({
      query: (suggestionId) => ({
        url: `/${suggestionId}`,
        method: 'GET',
      }),
      providesTags: ['suggestions'],
    }),

    // Delete a suggestion by ID (Admin)
    deleteSuggestion: builder.mutation({
      query: (suggestionId) => ({
        url: `/${suggestionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['suggestions'],
    }),
  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useSubmitSuggestionMutation,
  useFetchSuggestionsQuery,
  useFetchSuggestionByIdQuery,
  useDeleteSuggestionMutation,
} = suggestionApi;
