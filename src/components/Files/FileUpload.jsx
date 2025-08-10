import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import useFiles from "../../hooks/useFiles";

const FileUpload = ({ classroomId, onUploadComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const { uploadFile, isUploading, uploadProgress, error, clearError } =
    useFiles(classroomId);

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    onUploadComplete?.();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files);
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
      e.target.value = ""; // Reset input
    }
  };

  const getUploadProgressEntries = () => Object.entries(uploadProgress);

  return (
    <div className="space-y-4">
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center justify-between">
          <span>
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </span>
          <button onClick={clearError} className="hover:text-red-900">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Progress */}
      {getUploadProgressEntries().length > 0 && (
        <div className="space-y-2">
          {getUploadProgressEntries().map(([fileId, progress]) => (
            <div
              key={fileId}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Uploading...
                </span>
                <span className="text-sm text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50 shadow-lg"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="text-center">
          <i
            className={`fas fa-cloud-upload-alt text-5xl mb-4 transition-all ${
              isDragOver ? "text-blue-500" : "text-gray-400"
            }`}
          ></i>

          <p
            className={`text-sm mb-1 ${
              isDragOver ? "text-blue-700 font-medium" : "text-gray-600"
            }`}
          >
            {isDragOver
              ? "Drop files here"
              : "Drag files here or click to upload"}
          </p>

          <p className="text-xs text-gray-500">
            PDF, Images, Documents up to 10MB
          </p>

          {isUploading && (
            <div className="mt-3 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-sm text-blue-600">Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
      />

      {/* Supported Formats */}
      <div className="text-xs text-gray-500 text-center">
        <p className="mb-1">Supported formats:</p>
        <div className="flex flex-wrap justify-center gap-1">
          {["PDF", "DOC", "XLS", "PPT", "TXT", "JPG", "PNG", "GIF"].map(
            (format) => (
              <span key={format} className="bg-gray-100 px-2 py-1 rounded">
                {format}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
