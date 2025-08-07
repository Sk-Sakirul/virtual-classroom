import { createSlice } from "@reduxjs/toolkit"
import { loginUser, logoutUser, registerUser } from "./authThunks"


const initialState = {
    user : null,
    loading : false,
    error : null,
    role: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers : {},
    extraReducers: (builder) => {
        builder
         .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.role = action.payload.role;
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
         })
         .addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
         })
         .addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.role = null;
         })
    }
});


export default authSlice.reducer;