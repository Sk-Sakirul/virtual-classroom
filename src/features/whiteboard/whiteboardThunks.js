import { createAsyncThunk } from "@reduxjs/toolkit";
import whiteboardService from "../../services/whiteboardService.js";
import { setError } from "./whiteboardSlice.js";

export const saveDrawing = createAsyncThunk(
  "whiteboard/saveDrawing",
  async (
    { classroomId, drawingData, userId },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await whiteboardService.saveDrawingData(classroomId, drawingData, userId);
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const clearWhiteboardData = createAsyncThunk(
  "whiteboard/clearWhiteboard",
  async ({ classroomId, userId }, { dispatch, rejectWithValue }) => {
    try {
      await whiteboardService.clearWhiteboard(classroomId, userId);
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const undoLastAction = createAsyncThunk(
  "whiteboard/undoLastAction",
  async ({ classroomId, userId }, { dispatch, rejectWithValue }) => {
    try {
      await whiteboardService.undoLastAction(classroomId, userId);
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const saveWhiteboardState = createAsyncThunk(
  "whiteboard/saveWhiteboardState",
  async (
    { classroomId, canvasData, userId },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await whiteboardService.saveWhiteboardState(
        classroomId,
        canvasData,
        userId
      );
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);
