import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company_id: "",
  position_id: "",
  service_id: "",
  vacancy_id: "",
};

const idSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPositionId: (state, action) => {
      state.position_id = action.payload;
    },
    setServiceId: (state, action) => {
      state.service_id = action.payload;
    },
    setCompanyId: (state, action) => {
      state.company_id = action.payload;
    },
    setVacancyId: (state, action) => {
      state.vacancy_id = action.payload;
    },
  },
});

export const { setPositionId, setServiceId, setCompanyId, setVacancyId } =
  idSlice.actions;

export default idSlice.reducer;
