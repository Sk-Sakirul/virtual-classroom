import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawings: [],
  currentTool: "pen",
  currentColor: "#000000",
  brushSize: 3,
  isDrawing: false,
  canvasData: null,
  collaborators: [],
  history: [],
  historyIndex: -1,
  isLoading: false,
  error: null,
  lastModified: null,
  lastModifiedBy: null,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setDrawings: (state, action) => {
      state.drawings = action.payload;
    },
    addDrawing: (state, action) => {
      state.drawings.push(action.payload);
      // Add to history for undo/redo
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.drawings]);
      state.historyIndex = state.history.length - 1;
    },
    setCurrentTool: (state, action) => {
      state.currentTool = action.payload;
    },
    setCurrentColor: (state, action) => {
      state.currentColor = action.payload;
    },
    setBrushSize: (state, action) => {
      state.brushSize = action.payload;
    },
    setIsDrawing: (state, action) => {
      state.isDrawing = action.payload;
    },
    setCanvasData: (state, action) => {
      state.canvasData = action.payload;
    },
    setCollaborators: (state, action) => {
      state.collaborators = action.payload;
    },
    addCollaborator: (state, action) => {
      const existingCollaborator = state.collaborators.find(
        (collab) => collab.userId === action.payload.userId
      );
      if (!existingCollaborator) {
        state.collaborators.push(action.payload);
      }
    },
    removeCollaborator: (state, action) => {
      state.collaborators = state.collaborators.filter(
        (collab) => collab.userId !== action.payload
      );
    },
    clearWhiteboard: (state) => {
      state.drawings = [];
      state.canvasData = null;
      // Add to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([]);
      state.historyIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.drawings = [...state.history[state.historyIndex]];
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.drawings = [...state.history[state.historyIndex]];
      }
    },
    initializeHistory: (state) => {
      state.history = [[]];
      state.historyIndex = 0;
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
    setLastModified: (state, action) => {
      state.lastModified = action.payload.timestamp;
      state.lastModifiedBy = action.payload.userId;
    },
  },
});

export const {
  setDrawings,
  addDrawing,
  setCurrentTool,
  setCurrentColor,
  setBrushSize,
  setIsDrawing,
  setCanvasData,
  setCollaborators,
  addCollaborator,
  removeCollaborator,
  clearWhiteboard,
  undo,
  redo,
  initializeHistory,
  setLoading,
  setError,
  clearError,
  setLastModified,
} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;
