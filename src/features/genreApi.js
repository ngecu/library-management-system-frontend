import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
const base_url = `${host}/genre`;
console.log("tokenn ", token);

export const genreApi = createApi({
  reducerPath: 'genreApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['genres'],
  endpoints: (builder) => ({
    // Create a new genre
    createGenre: builder.mutation({
      query: (newGenre) => ({
        url: '',
        method: 'POST',
        body: newGenre,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['genres'],
    }),

    // Fetch all genres
    fetchGenres: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['genres'],
    }),

    // Fetch a genre by ID
    fetchGenreById: builder.query({
      query: (genreId) => ({
        url: `/${genreId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['genres'],
    }),

    // Update a genre by ID
    updateGenre: builder.mutation({
      query: ({ id, ...values }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['genres'],
    }),

    // Delete a genre by ID
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['genres'],
    }),
  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useCreateGenreMutation,
  useFetchGenresQuery,
  useFetchGenreByIdQuery,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
} = genreApi;
