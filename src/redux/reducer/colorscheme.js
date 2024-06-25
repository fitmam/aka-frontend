import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  color: {
    primary: "#3bc0c3",
    secondary: "#0d1034",
    text: "#ffffff",
  },
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

export const { setColor } = colorSlice.actions;

export default colorSlice.reducer;
