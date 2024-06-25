import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: null,
  role_id: null,
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setRoleId: (state, action) => {
      state.role_id = action.payload;
    },
  },
});

export const { setUserId, setRoleId } = usersSlice.actions;

export default usersSlice.reducer;
