// src/hooks/useAuth.js
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  signUpUser,
  signInUser,
  loginUser, // added alias for backward compatibility
  signInWithGoogle,
  signOutUser,
} from "../features/auth/authThunks.js";
import { clearError } from "../features/auth/authSlice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const signUp = useCallback(
    (email, password, displayName, role) => {
      return dispatch(signUpUser({ email, password, displayName, role }));
    },
    [dispatch]
  );

  const signIn = useCallback(
    (email, password) => {
      return dispatch(signInUser({ email, password }));
    },
    [dispatch]
  );

  // For components still expecting login()
  const login = useCallback(
    (email, password) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch]
  );

  const googleSignIn = useCallback(() => {
    return dispatch(signInWithGoogle());
  }, [dispatch]);

  const signOut = useCallback(() => {
    return dispatch(signOutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...authState,
    signUp,
    signIn,
    login, // added alias
    googleSignIn,
    signOut,
    clearAuthError,
  };
};

export default useAuth;
