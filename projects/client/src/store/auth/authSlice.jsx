import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    addUser: (state, { payload }) => {
      console.log("payload", payload);
      state.user = {
        email: payload.email,
        role: payload.role,
      };
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { logout, addUser } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
