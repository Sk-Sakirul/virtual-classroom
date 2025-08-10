import { useEffect } from "react";
import { useSelector } from "react-redux";
import useFiles from "../../hooks/useFiles.js";
import FilePreview from "./FilePreview.jsx";

const FileList = ({ classroomId }) => {
  const { user } = useSelector((state) => state.auth);
  const { files, isLoading, error, deleteFile, refreshFiles, clearError } =
    useFiles(classroomId);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleDeleteFile = async (fileDocId, storagePath) => {
    try {
      await deleteFile(fileDocId, storagePath);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const canDeleteFile = (file) => {
    return user && (user.uid === file.uploadedBy || user.role === "teacher");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-md animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-3 py-2 rounded-lg text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 transition"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800 text-lg">
          Shared Files{" "}
          <span className="text-gray-500 text-sm">({files.length})</span>
        </h4>
        <button
          onClick={refreshFiles}
          className="text-gray-500 hover:text-blue-500 p-2 rounded-lg transition-colors hover:bg-gray-100"
          title="Refresh"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50">
          <i className="fas fa-folder-open text-3xl mb-3 opacity-50"></i>
          <p className="font-medium">No files shared yet</p>
          <p className="text-sm text-gray-400">
            Upload files to share with the class
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
          {files.map((file) => (
            <div
              key={file.docId}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-3"
            >
              <FilePreview
                file={file}
                onDelete={handleDeleteFile}
                canDelete={canDeleteFile(file)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
