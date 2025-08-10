// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService.js";
import { setUser, setError, setLoading } from "./authSlice.js";

/**
 * Sign up new user
 */
export const signUpUser = createAsyncThunk(
  "auth/signUp",
  async ({ email, password, displayName, role }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const userData = await authService.signUp(email, password, displayName, role);
      dispatch(setUser(userData));
      return userData;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Sign in existing user (email/password)
 */
export const signInUser = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const userData = await authService.signIn(email, password);
      dispatch(setUser(userData));
      return userData;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

// Alias for backward compatibility (Login.jsx may import this)
export const loginUser = signInUser;

/**
 * Sign in with Google
 */
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const userData = await authService.signInWithGoogle();
      dispatch(setUser(userData));
      return userData;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Sign out
 */
export const signOutUser = createAsyncThunk(
  "auth/signOut",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await authService.signOut();
      dispatch(setUser(null));
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);
