import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../../types/user";

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
    },
    updateUserInvitations: (state, action: PayloadAction<string[]>) => {
      if (state.profile) {
        state.profile.receivedInvitations = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, updateUserInvitations } = userSlice.actions;
export default userSlice.reducer;
