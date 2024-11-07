import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from './features/userApi';
import { mpesaApi } from './features/mpesaApi';
import { booksApi } from './features/booksApi';
import { transactionApi } from './features/transactionApi';
import { genreApi } from './features/genreApi';
import { suggestionApi } from './features/suggestionApi';
import { requestsApi } from './features/requestApi';
import { systemSettingsApi } from './features/systemSettingsApi';
import { exportApi } from './features/exportApi';
import { llcApi } from './features/llcApi';



export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [mpesaApi.reducerPath]: mpesaApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [genreApi.reducerPath]: genreApi.reducer,
    [suggestionApi.reducerPath]: suggestionApi.reducer,
    [requestsApi.reducerPath]: requestsApi.reducer,
    [systemSettingsApi.reducerPath]: systemSettingsApi.reducer,
    [exportApi.reducerPath]: exportApi.reducer,
    [llcApi.reducerPath]: llcApi.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      mpesaApi.middleware,
      booksApi.middleware,
      transactionApi.middleware,
      genreApi.middleware,
      suggestionApi.middleware,
      requestsApi.middleware,
      systemSettingsApi.middleware,
      exportApi.middleware,
      llcApi.middleware,

    ),
});

setupListeners(store.dispatch);