// store.js
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import bolimReducer from "./store/bolimSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    bolim: bolimReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
