import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";


export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, {rejectWithValue}) => {
    try {
        return await authService.login(credentials.email, credentials.password);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const registerUser = createAsyncThunk("auth/registerUser", async (data, {rejectWithValue}) => {
    try {
        return await authService.register(data.email, data.password, data.role);
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
    return await authService.logout();
})