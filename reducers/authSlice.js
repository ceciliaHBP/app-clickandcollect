import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  selectedStore: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.user = action.payload;
    },
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    updateSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
  },
});

export const { registerUser, loginUser, logoutUser, updateSelectedStore } = authSlice.actions;
export default authSlice.reducer;
