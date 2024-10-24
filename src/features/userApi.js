import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
const base_url = `${host}/users`;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['users'],
  endpoints: (builder) => ({
    // Register a new user
    register: builder.mutation({
      query: (newUser) => ({
        url: '',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['users'],
    }),

     // Add the new createUser mutation
     createUser: builder.mutation({
      query: (userData) => ({
        url: '/create',
        method: 'POST',
        body: userData,
        headers: {
          Authorization: `Bearer ${token}`, // Include the token if necessary
        },
      }),
      invalidatesTags: ['users'],
    }),

    // Login and get a token
    login: builder.mutation({
      query: (userData) => ({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['users'],
    }),

    // Get user profile (protected)
    fetchUser: builder.query({
      query: () => ({
        url: '/profile',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['users'],
    }),

    // Update user profile (protected)
    updateUserProfile: builder.mutation({
      query: (values) => ({
        url: '/profile',
        method: 'PUT',
        body: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['users'],
    }),

    // Get all users (admin)
    fetchUsers: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['users'],
    }),

    fetchPatrons: builder.query({
      query: () => ({
        url: '/patrons',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['users'],
    }),

    // Get a user by ID (admin)
    fetchUserById: builder.query({
      query: (userId) => ({
        url: `/${userId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['users'],
    }),

    // Update a user by ID (admin)
    updateUser: builder.mutation({
      query: ({ id, ...values }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['users'],
    }),

    // Delete a user by ID (admin)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['users'],
    }),

    // Update user status (admin)
    updateStatus: builder.mutation({
      query: ({ id, ...values }) => ({
        url: `/status/${id}`,
        method: 'PUT',
        body: values,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['users'],
    }),

    // Request password reset (POST)
    requestPasswordReset: builder.mutation({
      query: ({email}) => ({
        url: '/reset-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // Reset password with token (PUT)
    resetPassword: builder.mutation({
      query: ({  email }) => ({
        url: `/reset-password`,
        method: 'PUT',
        body: { email },
      }),
    }),
  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useRegisterMutation,
  useCreateUserMutation,
  useLoginMutation,
  useFetchUserQuery,
  useFetchPatronsQuery,
  useUpdateUserProfileMutation,
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useUpdateUserMutation,
  useUpdateStatusMutation,
  useDeleteUserMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = userApi;
