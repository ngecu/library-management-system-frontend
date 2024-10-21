import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
const base_url = `${host}/books`;

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['books'],
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

    //Fetch book copies
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
} = booksApi;
