import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import userReducer from "../store/slices/userSlice";
import partnerReducer from "../store/slices/partnerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    partner: partnerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
