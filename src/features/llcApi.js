import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
const base_url = `${host}/genre`;

export const llcApi = createApi({
  reducerPath: 'llcApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['LLCs'],
  endpoints: (builder) => ({
    // Get all LLCs
    fetchLLCs: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['LLCs'],
    }),

    // Get a single LLC by ID
    fetchLLCById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['LLCs'],
    }),

    // Create a new LLC
    addLLC: builder.mutation({
      query: (newLLC) => ({
        url: '/',
        method: 'POST',
        body: newLLC,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['LLCs'],
    }),

    // Update an LLC by ID
    updateLLC: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['LLCs'],
    }),

    // Delete an LLC by ID
    deleteLLC: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['LLCs'],
    }),
  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useFetchLLCsQuery,
  useFetchLLCByIdQuery,
  useAddLLCMutation,
  useUpdateLLCMutation,
  useDeleteLLCMutation,
} = llcApi;
