import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingState, LoadingKey } from "../../types/loading";

const initialState: LoadingState = {};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ key: LoadingKey; isLoading: boolean }>
    ) => {
      state[action.payload.key] = action.payload.isLoading;
    },
    clearLoading: (state, action: PayloadAction<LoadingKey>) => {
      delete state[action.payload];
    },
    clearAllLoading: () => {
      return {};
    },
  },
});

export const { setLoading, clearLoading, clearAllLoading } =
  loadingSlice.actions;
export default loadingSlice.reducer;
