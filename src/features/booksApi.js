import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
const base_url = `${host}/books`;

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['books', 'transactions', 'waitingList'],
  endpoints: (builder) => ({
    // Fetch all books
    fetchBooks: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['books'],
    }),

    // Fetch book copies
    fetchBookCopies: builder.query({
      query: () => ({
        url: '/bookCopies',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['bookCopies'],
    }),

    // Fetch a book by ID
    fetchBookById: builder.query({
      query: (bookId) => ({
        url: `/${bookId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['books'],
    }),

    // Add a new book
    addBook: builder.mutation({
      query: (newBook) => ({
        url: '/',
        method: 'POST',
        body: newBook,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['books'],
    }),

    // Update a book by ID
    updateBook: builder.mutation({
      query: ({ id, ...updatedBook }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updatedBook,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['books'],
    }),

    // Delete a book by ID
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `/${bookId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['books'],
    }),

    // Borrow a book
    borrowBook: builder.mutation({
      query: (borrowData) => ({
        url: '/borrow',
        method: 'POST',
        body: borrowData,
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

    // Book a book (join the waiting list)
    bookBook: builder.mutation({
      query: (bookData) => ({
        url: '/book',
        method: 'POST',
        body: bookData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['waitingList'],
    }),

    // Get waiting list for a specific book
    fetchWaitingList: builder.query({
      query: (bookId) => ({
        url: `/${bookId}/waiting-list`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['waitingList'],
    }),

    // Get user position in the queue for a book
    fetchUserQueuePosition: builder.query({
      query: ({ bookId, userId }) => ({
        url: `/${bookId}/user/${userId}/position`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['waitingList'],
    }),

    // Fetch all transactions (Admin route)
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

    // Fetch transactions by user
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

    // Fetch overdue transactions
    fetchOverdueTransactions: builder.query({
      query: () => ({
        url: '/overdue',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['transactions'],
    }),
  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useFetchBooksQuery,
  useFetchBookCopiesQuery,
  useFetchBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useReturnBookMutation,
  useRenewBookMutation,
  useBookBookMutation,
  useFetchWaitingListQuery,
  useFetchUserQueuePositionQuery,
  useFetchTransactionsQuery,
  useFetchTransactionsByUserQuery,
  useFetchOverdueTransactionsQuery,
} = booksApi;
