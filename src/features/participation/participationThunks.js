import { createAsyncThunk } from "@reduxjs/toolkit";
import participationService from "../../services/participationService.js";
import {
  setError,
  setLoading,
  setMetrics,
  setTopParticipants,
  setEngagementOverTime,
} from "./participationSlice.js";

export const fetchParticipationMetrics = createAsyncThunk(
  "participation/fetchMetrics",
  async ({ classroomId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const metrics = await participationService.getParticipationMetrics(
        classroomId
      );
      dispatch(setMetrics(metrics));
      return metrics;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopParticipants = createAsyncThunk(
  "participation/fetchTopParticipants",
  async ({ classroomId, limit = 10 }, { dispatch, rejectWithValue }) => {
    try {
      const topParticipants = await participationService.getTopParticipants(
        classroomId,
        limit
      );
      dispatch(setTopParticipants(topParticipants));
      return topParticipants;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEngagementOverTime = createAsyncThunk(
  "participation/fetchEngagementOverTime",
  async (
    { classroomId, timeRange = "1hour" },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const engagementData = await participationService.getEngagementOverTime(
        classroomId,
        timeRange
      );
      dispatch(setEngagementOverTime(engagementData));
      return engagementData;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const trackEngagement = createAsyncThunk(
  "participation/trackEngagement",
  async (
    { classroomId, userId, engagementData },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await participationService.trackEngagement(
        classroomId,
        userId,
        engagementData
      );
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const trackQuestion = createAsyncThunk(
  "participation/trackQuestion",
  async ({ classroomId, userId }, { dispatch }) => {
    try {
      await participationService.trackQuestion(classroomId, userId);
    } catch (error) {
      console.error("Failed to track question:", error);
    }
  }
);

export const trackFileShare = createAsyncThunk(
  "participation/trackFileShare",
  async ({ classroomId, userId }, { dispatch }) => {
    try {
      await participationService.trackFileShare(classroomId, userId);
    } catch (error) {
      console.error("Failed to track file share:", error);
    }
  }
);

export const trackWhiteboardInteraction = createAsyncThunk(
  "participation/trackWhiteboardInteraction",
  async ({ classroomId, userId }, { dispatch }) => {
    try {
      await participationService.trackWhiteboardInteraction(
        classroomId,
        userId
      );
    } catch (error) {
      console.error("Failed to track whiteboard interaction:", error);
    }
  }
);
