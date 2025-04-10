import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Partner, PartnerState } from "../../types/partner";

const initialState: PartnerState = {
  partner: null,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    setPartner: (state, action: PayloadAction<Partner>) => {
      state.partner = action.payload;
    },
    clearPartner: (state) => {
      state.partner = null;
    },
  },
});

export const { setPartner, clearPartner } = partnerSlice.actions;
export default partnerSlice.reducer;
