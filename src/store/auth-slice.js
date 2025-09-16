import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  token: null,
  userEmail: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    signup(state, action) {
      state.token = action.payload.token;
      state.userEmail = action.payload.email;
      state.isAuthenticated = true;
      state.error = null;
    },
    login(state, action) {
      state.token = action.payload.token;
      state.userEmail = action.payload.email;
      state.isAuthenticated = true;
      console.log(state.token);
      state.error = null;
    },
    logout(state) {
      state.token = null;
      state.userEmail = null;
      state.isAuthenticated = false;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
