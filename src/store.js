import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from './features/userApi';
import { mpesaApi } from './features/mpesaApi';
import { booksApi } from './features/booksApi';
import { transactionApi } from './features/transactionApi';
import { genreApi } from './features/genreApi';


export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [mpesaApi.reducerPath]: mpesaApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [genreApi.reducerPath]: genreApi.reducer,

    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      mpesaApi.middleware,
      booksApi.middleware,
      transactionApi.middleware,
      genreApi.middleware,

    ),
});

setupListeners(store.dispatch);