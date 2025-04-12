import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import userReducer from "../store/slices/userSlice";
import partnerReducer from "../store/slices/partnerSlice";
import loadingReducer from "../store/slices/loadingSlice";
import weddingReducer from "../store/slices/weddingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    partner: partnerReducer,
    loading: loadingReducer,
    wedding: weddingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
