import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/setUser"],
        ignoredPaths: ["auth.user"],
      },
    }),
//   devTools: process.env.NODE_ENV !== "production",
});

export default store;
