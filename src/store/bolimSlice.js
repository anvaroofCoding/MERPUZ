import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bolim: localStorage.getItem("selectedBolim") || "",
};

const bolimSlice = createSlice({
  name: "bolim",
  initialState,
  reducers: {
    setBolim: (state, action) => {
      state.bolim = action.payload;
      localStorage.setItem("selectedBolim", action.payload);
    },
  },
});

export const { setBolim } = bolimSlice.actions;
export default bolimSlice.reducer;
