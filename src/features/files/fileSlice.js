import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: [],
  uploadProgress: {},
  isUploading: false,
  isLoading: false,
  error: null,
  dragOver: false,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
      state.isLoading = false;
    },
    addFile: (state, action) => {
      state.files.unshift(action.payload);
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((file) => file.docId !== action.payload);
    },
    setUploadProgress: (state, action) => {
      const { fileId, progress } = action.payload;
      state.uploadProgress[fileId] = progress;
    },
    clearUploadProgress: (state, action) => {
      delete state.uploadProgress[action.payload];
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isUploading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setDragOver: (state, action) => {
      state.dragOver = action.payload;
    },
    clearFiles: (state) => {
      state.files = [];
      state.uploadProgress = {};
    },
  },
});

export const {
  setFiles,
  addFile,
  removeFile,
  setUploadProgress,
  clearUploadProgress,
  setIsUploading,
  setLoading,
  setError,
  clearError,
  setDragOver,
  clearFiles,
} = filesSlice.actions;

export default filesSlice.reducer;
