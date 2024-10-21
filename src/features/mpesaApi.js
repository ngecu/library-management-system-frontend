import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const base_url = 'http://localhost:5000/api';

export const mpesaApi = createApi({
  reducerPath: 'mpesaApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  endpoints: (builder) => ({
    initiateSTKPush: builder.mutation({
      query: (stkData) => ({
        url: '/mpesa/stkPush', // The backend MPESA endpoint
        method: 'POST',
        body: stkData, // Phone number and amount sent to initiate the push
      }),
    }),
  }),
});

export const { useInitiateSTKPushMutation } = mpesaApi;
