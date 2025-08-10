import { createAsyncThunk } from "@reduxjs/toolkit";
import fileService from "../../services/fileService.js";
import {
  setError,
  setLoading,
  addFile,
  setIsUploading,
  setUploadProgress,
  clearUploadProgress,
} from "./fileSlice.js";

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (
    { file, classroomId, userId, userName },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Validate file first
      fileService.validateFile(file);

      const fileId = `upload_${Date.now()}_${file.name}`;
      dispatch(setIsUploading(true));
      dispatch(setUploadProgress({ fileId, progress: 0 }));

      // Simulate upload progress (in real implementation, use Firebase upload progress)
      const uploadPromise = fileService.uploadFile(
        file,
        classroomId,
        userId,
        userName
      );

      // Mock progress updates
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 20;
        dispatch(setUploadProgress({ fileId, progress }));
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 200);

      const fileData = await uploadPromise;

      dispatch(addFile(fileData));
      dispatch(clearUploadProgress(fileId));
      dispatch(setIsUploading(false));

      return fileData;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setIsUploading(false));
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async ({ classroomId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const files = await fileService.getFiles(classroomId);
      return files;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (
    { classroomId, fileDocId, storagePath },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await fileService.deleteFile(classroomId, fileDocId, storagePath);
      return fileDocId;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);
