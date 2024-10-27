import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
const base_url = `${host}/requests`;

export const requestsApi = createApi({
  reducerPath: 'requestsApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['requests', 'notifications'],
  endpoints: (builder) => ({
    // Fetch all book requests
    fetchRequests: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['requests'],
    }),

    // Create a new book request
    createRequest: builder.mutation({
      query: (newRequest) => ({
        url: '/',
        method: 'POST',
        body: newRequest,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['requests'],
    }),

    // Update the status of a specific book request
    updateRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['requests'],
    }),

    // Delete a specific book request
    deleteRequest: builder.mutation({
      query: (requestId) => ({
        url: `/${requestId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['requests'],
    }),

    // Notify the user when the book becomes available
    notifyUser: builder.mutation({
      query: (id) => ({
        url: `/${id}/notify`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['notifications'],
    }),
  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useFetchRequestsQuery,
  useCreateRequestMutation,
  useUpdateRequestStatusMutation,
  useDeleteRequestMutation,
  useNotifyUserMutation,
} = requestsApi;
