import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  token: string | null;
}
interface User {
  userId: string;
  email: string;
  picture: string | null;
  name: string;
  subscription: "BASIC" | "PREMIUM";
  partnerId: string | null;
  weddingId: string | null;
  receivedInvitations: string[];
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: {
          userId: string;
          email: string;
          name: string;
          picture: string | null;
          subscription: "BASIC" | "PREMIUM";
          partnerId: string | null;
          weddingId: string | null;
          receivedInvitations: string[];
        };
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
