import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  uploadFile,
  fetchFiles,
  deleteFile,
} from "../features/files/fileThunks.js";
import { setDragOver, clearError } from "../features/files/fileSlice.js";
import fileService from "../services/fileService.js";

export const useFiles = (classroomId) => {
  const dispatch = useDispatch();
  const filesState = useSelector((state) => state.files);
  const { user } = useSelector((state) => state.auth);

  // Fetch files on mount
  useEffect(() => {
    if (classroomId) {
      dispatch(fetchFiles({ classroomId }));
    }
  }, [classroomId, dispatch]);

  const uploadFileHandler = useCallback(
    async (file) => {
      if (!user || !file) return;

      try {
        // Validate file
        fileService.validateFile(file);

        const result = await dispatch(
          uploadFile({
            file,
            classroomId,
            userId: user.uid,
            userName: user.displayName,
          })
        );

        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    [dispatch, classroomId, user]
  );

  const deleteFileHandler = useCallback(
    async (fileDocId, storagePath) => {
      try {
        const result = await dispatch(
          deleteFile({
            classroomId,
            fileDocId,
            storagePath,
          })
        );

        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    [dispatch, classroomId]
  );

  const refreshFiles = useCallback(() => {
    if (classroomId) {
      dispatch(fetchFiles({ classroomId }));
    }
  }, [classroomId, dispatch]);

  const setDragOverState = useCallback(
    (isDragOver) => {
      dispatch(setDragOver(isDragOver));
    },
    [dispatch]
  );

  const clearFilesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle drag and drop
  const handleDragOver = useCallback(
    (event) => {
      event.preventDefault();
      setDragOverState(true);
    },
    [setDragOverState]
  );

  const handleDragLeave = useCallback(
    (event) => {
      event.preventDefault();
      setDragOverState(false);
    },
    [setDragOverState]
  );

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      setDragOverState(false);

      const files = Array.from(event.dataTransfer.files);
      const uploadPromises = files.map((file) => uploadFileHandler(file));

      try {
        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    },
    [setDragOverState, uploadFileHandler]
  );

  const handleFileInput = useCallback(
    async (event) => {
      const files = Array.from(event.target.files);
      const uploadPromises = files.map((file) => uploadFileHandler(file));

      try {
        await Promise.all(uploadPromises);
        // Clear the input so the same file can be selected again
        event.target.value = "";
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    },
    [uploadFileHandler]
  );

  // Utility functions
  const getFileIcon = useCallback((fileType) => {
    return fileService.getFileIcon(fileType);
  }, []);

  const formatFileSize = useCallback((size) => {
    return fileService.formatFileSize(size);
  }, []);

  const isImageFile = useCallback((fileType) => {
    return fileService.isImageFile(fileType);
  }, []);

  const isPDFFile = useCallback((fileType) => {
    return fileService.isPDFFile(fileType);
  }, []);

  return {
    ...filesState,
    uploadFile: uploadFileHandler,
    deleteFile: deleteFileHandler,
    refreshFiles,
    setDragOver: setDragOverState,
    clearError: clearFilesError,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    getFileIcon,
    formatFileSize,
    isImageFile,
    isPDFFile,
  };
};

export default useFiles;