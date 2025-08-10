import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearError, logout } =
  authSlice.actions;
export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit"
// import { loginUser, logoutUser, registerUser } from "./authThunks"

// const initialState = {
//     user : null,
//     loading : false,
//     error : null,
//     role: null
// }

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers : {},
//     extraReducers: (builder) => {
//         builder
//          .addCase(loginUser.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//          })
//          .addCase(loginUser.fulfilled, (state, action) => {
//             state.loading = false;
//             state.user = action.payload.user;
//             state.role = action.payload.role;
//          })
//          .addCase(loginUser.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.payload;
//          })
//          .addCase(registerUser.fulfilled, (state, action) => {
//             state.user = action.payload.user;
//             state.role = action.payload.role;
//          })
//          .addCase(logoutUser.fulfilled, (state) => {
//             state.user = null;
//             state.role = null;
//          })
//     }
// });

// export default authSlice.reducer;
