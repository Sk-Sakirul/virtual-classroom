import { useState } from "react";
import { formatDate } from "../../utils/formatDate";

const FilePreview = ({ file, onDelete, canDelete = false }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getFileIcon = (fileType) => {
    const iconMap = {
      "application/pdf": "fas fa-file-pdf text-red-500",
      "application/msword": "fas fa-file-word text-blue-500",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "fas fa-file-word text-blue-500",
      "application/vnd.ms-excel": "fas fa-file-excel text-green-500",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "fas fa-file-excel text-green-500",
      "application/vnd.ms-powerpoint": "fas fa-file-powerpoint text-orange-500",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "fas fa-file-powerpoint text-orange-500",
      "text/plain": "fas fa-file-alt text-gray-500",
      "image/jpeg": "fas fa-file-image text-purple-500",
      "image/jpg": "fas fa-file-image text-purple-500",
      "image/png": "fas fa-file-image text-purple-500",
      "image/gif": "fas fa-file-image text-purple-500",
      "image/webp": "fas fa-file-image text-purple-500",
    };
    return iconMap[fileType] || "fas fa-file text-gray-500";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (fileType) => fileType?.startsWith("image/");

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    if (window.confirm("Are you sure you want to delete this file?")) {
      setIsDeleting(true);
      try {
        await onDelete(file.docId, file.storagePath);
      } catch (error) {
        console.error("Failed to delete file:", error);
        setIsDeleting(false);
      }
    }
  };

  const handleDownload = () => {
    if (file.downloadURL) window.open(file.downloadURL, "_blank");
  };

  return (
    <div
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3">
        {/* File Icon / Thumbnail */}
        <div className="flex-shrink-0">
          {isImageFile(file.type) && file.downloadURL ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={file.downloadURL}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = `<i class="${getFileIcon(
                    file.type
                  )} text-2xl"></i>`;
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
              <i className={`${getFileIcon(file.type)} text-xl`}></i>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-medium text-gray-800 truncate"
            title={file.name}
          >
            {file.name}
          </h4>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>{formatDate(file.uploadedAt)}</span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <i className="fas fa-user text-xs"></i>
            <span>{file.uploadedByName}</span>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`flex items-center gap-2 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleDownload}
            className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100 transition"
            title="Download"
            disabled={!file.downloadURL}
          >
            <i className="fas fa-download"></i>
          </button>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
              title="Delete"
            >
              {isDeleting ? (
                <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
              ) : (
                <i className="fas fa-trash"></i>
              )}
            </button>
          )}
        </div>
      </div>

      {/* PDF Preview Link */}
      {file.type === "application/pdf" && showActions && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={handleDownload}
            className="text-xs text-blue-500 hover:text-blue-600 transition"
          >
            <i className="fas fa-external-link-alt mr-1"></i>
            Open PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
