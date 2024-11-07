import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
const base_url = `${host}/transactions`;

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['transactions'],
  endpoints: (builder) => ({
    // Fetch all transactions
    fetchTransactions: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['transactions'],
    }),

    // Fetch a single transaction by ID
    fetchTransactionById: builder.query({
      query: (transactionId) => ({
        url: `/${transactionId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['transactions'],
    }),

    fetchOverdue: builder.query({
      query: () => ({
        url: `/overdue`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['transactions'],
    }),

    // Fetch transactions by user ID
    fetchTransactionsByUser: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['transactions'],
    }),

    // Borrow a book
    borrowBook: builder.mutation({
      query: (transactionData) => ({
        url: '/borrow',
        method: 'POST',
        body: transactionData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['transactions'],
    }),

    // Return a book
    returnBook: builder.mutation({
      query: (transactionId) => ({
        url: `/${transactionId}/return`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['transactions'],
    }),

    // Renew a book
    renewBook: builder.mutation({
      query: (transactionId) => ({
        url: `/${transactionId}/renew`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['transactions'],
    }),

      // Renew a book
      renewBook: builder.mutation({
        query: (transactionId) => ({
          url: `/${transactionId}/renew`,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        invalidatesTags: ['transactions'],
      }),
  
      // Update fine for an overdue book
      updateFineAmount: builder.mutation({
        query: (transactionId) => ({
          url: `/${transactionId}/fine`,
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        invalidatesTags: ['transactions'],
      }),
  
      // Add a user to the waiting list for a book
      addUserToWaitingList: builder.mutation({
        query: ({ bookId, userId }) => ({
          url: `/book`,
          method: 'POST',
          body: { bookId, userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        invalidatesTags: ['transactions'],
      }),
  
      // Get the waiting list for a specific book
      fetchWaitingList: builder.query({
        query: (bookId) => ({
          url: `/books/${bookId}/waiting-list`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        providesTags: ['transactions'],
      }),
      
      fetchUserQueuePosition: builder.query({
        query: ({ bookId, userId }) => ({
          url: `/books/${bookId}/user/${userId}/position`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        providesTags: ['transactions'],
      }),

      bookBook: builder.mutation({
        query: (data) => ({
          url: `/book`,
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        invalidatesTags: ['transactions'],
      }),

  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useFetchTransactionsQuery,
  useFetchTransactionByIdQuery,
  useFetchOverdueQuery,
  useFetchTransactionsByUserQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
  useRenewBookMutation,
  useUpdateFineAmountMutation,
  useAddUserToWaitingListMutation,
  useFetchWaitingListQuery,
  useFetchUserQueuePositionQuery,
  useBookBookMutation
} = transactionApi;