import { createAsyncThunk } from "@reduxjs/toolkit";
import videoService from "../../services/videoService.js";
import {
  setError,
  setMuted,
  setVideo,
  setScreenShare,
  setRaisedHand,
} from "./videoSlice.js";

export const toggleMute = createAsyncThunk(
  "video/toggleMute",
  async ({ classroomId, userId, isMuted }, { dispatch, rejectWithValue }) => {
    try {
      await videoService.toggleMute(classroomId, userId, isMuted);
      dispatch(setMuted(isMuted));
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const toggleVideo = createAsyncThunk(
  "video/toggleVideo",
  async ({ classroomId, userId, hasVideo }, { dispatch, rejectWithValue }) => {
    try {
      await videoService.toggleVideo(classroomId, userId, hasVideo);
      dispatch(setVideo(hasVideo));
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const toggleScreenShare = createAsyncThunk(
  "video/toggleScreenShare",
  async (
    { classroomId, userId, isScreenSharing },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await videoService.toggleScreenShare(
        classroomId,
        userId,
        isScreenSharing
      );
      dispatch(setScreenShare(isScreenSharing));
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const toggleRaiseHand = createAsyncThunk(
  "video/toggleRaiseHand",
  async (
    { classroomId, userId, hasRaisedHand },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await videoService.raiseHand(classroomId, userId, hasRaisedHand);
      dispatch(setRaisedHand(hasRaisedHand));
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const joinSession = createAsyncThunk(
  "video/joinSession",
  async ({ classroomId, userData }, { dispatch, rejectWithValue }) => {
    try {
      await videoService.joinSession(classroomId, userData);
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const leaveSessionThunk = createAsyncThunk(
  "video/leaveSession",
  async ({ classroomId, userId }, { dispatch, rejectWithValue }) => {
    try {
      await videoService.leaveSession(classroomId, userId);
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);
