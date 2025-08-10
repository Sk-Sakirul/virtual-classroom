import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useChat from "../../hooks/useChat.js";
import useFiles from "../../hooks/useFiles.js";
import Message from "./Message.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import FileUpload from "../Files/FileUpload.jsx";

const ChatBox = ({ classroomId }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const {
    filter,
    typingUsers,
    error,
    sendMessage,
    setTyping,
    setFilter,
    getFilteredMessages,
    clearError,
  } = useChat(classroomId);

  const { handleDragOver, handleDragLeave, handleDrop, dragOver } =
    useFiles(classroomId);

  const filteredMessages = getFilteredMessages();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage("");
      handleStopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleStartTyping();
  };

  const handleStartTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    setIsTyping(false);
    setTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const filterOptions = [
    { id: "all", label: "All", icon: "fas fa-comments" },
    { id: "questions", label: "Questions", icon: "fas fa-question-circle" },
    { id: "files", label: "Files", icon: "fas fa-file" },
  ];

  return (
    <section className="rounded-3xl p-6 shadow-2xl bg-white  h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-comments text-blue-500 mr-3"></i>
          Chat & Files
        </h3>
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-3 py-2 text-xs rounded-lg transition-all font-medium ${
                filter === option.id
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <i className={`${option.icon} mr-1`}></i>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto pr-2 space-y-3 ${
          dragOver
            ? "bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg"
            : ""
        }`}
        style={{ height: "calc(100% - 140px)" }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-comments text-3xl mb-3 opacity-50"></i>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <Message key={msg.id} message={msg} currentUserId={user?.uid} />
          ))
        )}

        <TypingIndicator users={typingUsers} />
        <div ref={chatEndRef} />
      </div>

      {showFileUpload && (
        <div className="mb-4">
          <FileUpload
            classroomId={classroomId}
            onUploadComplete={() => setShowFileUpload(false)}
          />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowFileUpload(!showFileUpload)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            showFileUpload
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          title="Upload File"
        >
          <i className="fas fa-paperclip"></i>
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
            placeholder="Type your message..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            maxLength={500}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Add Emoji"
          >
            <i className="fas fa-smile"></i>
          </button>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="
            w-10 h-10
            bg-gradient-to-r from-blue-500 to-purple-500
            text-white rounded-xl
            enabled:hover:from-blue-600 enabled:hover:to-purple-600
            enabled:transition-all enabled:transform enabled:hover:scale-105
            flex items-center justify-center shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          "
          title="Send Message"
        >
          <i className="fas fa-paper-plane text-blue-200"></i>
        </button>
      </form>
    </section>
  );
};

export default ChatBox;
