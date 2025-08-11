import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  saveDrawing,
  clearWhiteboardData,
  undoLastAction,
  saveWhiteboardState,
} from "../features/whiteboard/whiteboardThunks.js";
import {
  setCurrentTool,
  setCurrentColor,
  setBrushSize,
  setIsDrawing,
  addDrawing,
  clearWhiteboard,
  undo,
  redo,
  setDrawings,
  setLastModified,
  clearError,
} from "../features/whiteboard/whiteboardSlice.js";
import whiteboardService from "../services/whiteboardService.js";

export const useWhiteboard = (classroomId) => {
  const dispatch = useDispatch();
  const whiteboardState = useSelector((state) => state.whiteboard);
  const { user } = useSelector((state) => state.auth);

  // Subscribe to whiteboard changes
  useEffect(() => {
    if (!classroomId) return;

    const unsubscribe = whiteboardService.subscribeToWhiteboard(
      classroomId,
      (whiteboardData) => {
        dispatch(setDrawings(whiteboardData.drawings));
        if (whiteboardData.lastModified && whiteboardData.lastModifiedBy) {
          dispatch(
            setLastModified({
              timestamp: whiteboardData.lastModified,
              userId: whiteboardData.lastModifiedBy,
            })
          );
        }
      }
    );

    return () => unsubscribe();
  }, [classroomId, dispatch]);

  const saveDrawingData = useCallback(
    (drawingData) => {
      if (!user) return;

      const drawingWithId = {
        ...drawingData,
        id: whiteboardService.generateDrawingId(),
      };

      dispatch(addDrawing(drawingWithId));

      return dispatch(
        saveDrawing({
          classroomId,
          drawingData: drawingWithId,
          userId: user.uid,
        })
      );
    },
    [dispatch, classroomId, user]
  );

  const clearBoard = useCallback(() => {
    if (!user) return;

    dispatch(clearWhiteboard());
    return dispatch(
      clearWhiteboardData({
        classroomId,
        userId: user.uid,
      })
    );
  }, [dispatch, classroomId, user]);

  const undoAction = useCallback(() => {
    dispatch(undo());
    if (user) {
      dispatch(
        undoLastAction({
          classroomId,
          userId: user.uid,
        })
      );
    }
  }, [dispatch, classroomId, user]);

  const redoAction = useCallback(() => {
    dispatch(redo());
  }, [dispatch]);

  const setTool = useCallback(
    (tool) => {
      dispatch(setCurrentTool(tool));
    },
    [dispatch]
  );

  const setColor = useCallback(
    (color) => {
      dispatch(setCurrentColor(color));
    },
    [dispatch]
  );

  const setBrush = useCallback(
    (size) => {
      dispatch(setBrushSize(size));
    },
    [dispatch]
  );

  const setDrawing = useCallback(
    (isDrawing) => {
      dispatch(setIsDrawing(isDrawing));
    },
    [dispatch]
  );

  const saveCanvas = useCallback(
    (canvasData) => {
      if (!user) return;

      return dispatch(
        saveWhiteboardState({
          classroomId,
          canvasData,
          userId: user.uid,
        })
      );
    },
    [dispatch, classroomId, user]
  );

  const clearWhiteboardError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const canUndo = whiteboardState.historyIndex > 0;
  const canRedo =
    whiteboardState.historyIndex < whiteboardState.history.length - 1;

  return {
    ...whiteboardState,
    saveDrawing: saveDrawingData,
    clearBoard,
    undo: undoAction,
    redo: redoAction,
    setTool,
    setColor,
    setBrush,
    setDrawing,
    saveCanvas,
    clearError: clearWhiteboardError,
    canUndo,
    canRedo,
  };
};

export default useWhiteboard;
