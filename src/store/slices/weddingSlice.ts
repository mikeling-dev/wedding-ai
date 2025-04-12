import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Wedding } from "@/types/wedding";

interface WeddingState {
  weddings: Wedding[];
  loading: boolean;
  error: string | null;
}

const initialState: WeddingState = {
  weddings: [],
  loading: false,
  error: null,
};

const weddingSlice = createSlice({
  name: "wedding",
  initialState,
  reducers: {
    setWeddings: (state, action: PayloadAction<Wedding[]>) => {
      state.weddings = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearWeddings: (state) => {
      state.weddings = [];
      state.loading = false;
      state.error = null;
    },
    setWeddingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setWeddingError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setWeddings,
  clearWeddings,
  setWeddingLoading,
  setWeddingError,
} = weddingSlice.actions;

export default weddingSlice.reducer;
