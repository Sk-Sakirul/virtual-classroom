import { formatDate } from "../../utils/formatDate";

const Message = ({ message, currentUserId }) => {
  const isOwnMessage = message.userId === currentUserId;
  const isTeacher =
    message.userName?.toLowerCase().includes("teacher") ||
    message.userName?.toLowerCase().includes("dr.");

  const getMessageTypeIcon = () => {
    switch (message.type) {
      case "file":
        return "fas fa-file";
      case "question":
        return "fas fa-question-circle";
      default:
        return null;
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    const iconMap = {
      pdf: "fas fa-file-pdf text-red-500",
      doc: "fas fa-file-word text-blue-500",
      docx: "fas fa-file-word text-blue-500",
      xls: "fas fa-file-excel text-green-500",
      xlsx: "fas fa-file-excel text-green-500",
      ppt: "fas fa-file-powerpoint text-orange-500",
      pptx: "fas fa-file-powerpoint text-orange-500",
      jpg: "fas fa-file-image text-purple-500",
      jpeg: "fas fa-file-image text-purple-500",
      png: "fas fa-file-image text-purple-500",
      gif: "fas fa-file-image text-purple-500",
      txt: "fas fa-file-alt text-gray-500",
    };
    return iconMap[extension] || "fas fa-file text-gray-500";
  };

  const getUserInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (userId) => {
    const colors = [
      "bg-green-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = userId ? userId.length % colors.length : 0;
    return colors[index];
  };

  return (
    <div
      className={`flex items-start mb-4 px-2 sm:px-4 ${
        isOwnMessage ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 ${getAvatarColor(
          message.userId
        )} rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs sm:text-sm font-bold`}
      >
        {getUserInitials(message.displayName || message.userName)}
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        } flex-1`}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1 max-w-full">
          <span
            className={`text-xs sm:text-sm font-semibold truncate ${
              isTeacher ? "text-yellow-600" : "text-gray-800"
            }`}
          >
            {isTeacher && <i className="fas fa-crown text-yellow-500 mr-1"></i>}
            {message.displayName || message.userName || "Anonymous"}
          </span>
          {message.type && message.type !== "text" && (
            <i
              className={`${getMessageTypeIcon()} text-xs ${
                message.type === "question" ? "text-blue-500" : "text-gray-500"
              }`}
            ></i>
          )}
          <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
            {formatDate(message.timestamp)}
          </span>
        </div>

        {/* Message Text */}
        {message.text && (
          <div
            className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2 break-words max-w-[85%] sm:max-w-[65%] lg:max-w-[55%] ${
              isOwnMessage
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none"
            }`}
          >
            <p className="text-xs sm:text-sm">{message.text}</p>
          </div>
        )}

        {/* File Attachment */}
        {message.type === "file" && message.fileData && (
          <div
            className={`mt-2 bg-gray-50 rounded-xl p-3 border border-gray-200 max-w-[85%] sm:max-w-[65%] lg:max-w-[55%] ${
              isOwnMessage ? "" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <i
                className={`${getFileIcon(message.fileData.name)} text-lg`}
              ></i>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                  {message.fileData.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {message.fileData.size
                    ? `${(message.fileData.size / 1024).toFixed(1)} KB`
                    : "Unknown size"}
                </p>
              </div>
              {message.fileData.downloadURL && (
                <a
                  href={message.fileData.downloadURL}
                  download={message.fileData.name}
                  className="text-blue-500 hover:text-blue-600 flex-shrink-0"
                  title="Download"
                >
                  <i className="fas fa-download"></i>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          className={`flex items-center space-x-2 mt-1 text-[10px] sm:text-xs text-gray-400 ${
            isOwnMessage ? "justify-end" : "justify-start"
          }`}
        >
          <button className="hover:text-blue-500 flex items-center gap-1">
            <i className="fas fa-reply"></i> Reply
          </button>
          {isOwnMessage && (
            <button className="hover:text-red-500 flex items-center gap-1">
              <i className="fas fa-trash"></i> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
