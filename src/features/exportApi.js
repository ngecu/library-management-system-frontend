// features/exportApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token; // Get the token from local storage
const base_url = `${host}/export`; // Set the base URL for export API

export const exportApi = createApi({
  reducerPath: 'exportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [], // No specific tags for export
  endpoints: (builder) => ({
    // Export the database as a ZIP file
    exportDatabase: builder.query({
      query: () => ({
        url: '/', // Endpoint for exporting
        method: 'GET',
        responseHandler: (response) => response.blob(), // Handle the response as a Blob
      }),
    }),
  }),
});

// Export hooks for using the export query in components
export const { useExportDatabaseQuery } = exportApi;
