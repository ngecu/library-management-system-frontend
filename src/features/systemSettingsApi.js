import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { host } from '../../environment';

const user = JSON.parse(localStorage.getItem("login"));
const token = user?.token;
console.log("Token is", token);

const base_url = `${host}/system-settings`;

export const systemSettingsApi = createApi({
  reducerPath: 'systemSettingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  tagTypes: ['SystemSettings'],
  endpoints: (builder) => ({
    // Get system settings
    getSystemSettings: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['SystemSettings'],
    }),

    // Update system settings
    updateSystemSettings: builder.mutation({
      query: (updatedSettings) => ({
        url: '/',
        method: 'PUT',
        body: updatedSettings,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['SystemSettings'],
    }),

    // Create new system settings (if not already existing)
    createSystemSettings: builder.mutation({
      query: (newSettings) => ({
        url: '/',
        method: 'POST',
        body: newSettings,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['SystemSettings'],
    }),

    // Reset system settings to default
    resetSystemSettings: builder.mutation({
      query: () => ({
        url: '/reset',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['SystemSettings'],
    }),
  }),
});

// Export hooks for using the queries and mutations in components
export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useCreateSystemSettingsMutation,
  useResetSystemSettingsMutation,
} = systemSettingsApi;
