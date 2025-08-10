import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  sendMessage,
  shareFile,
  setTypingStatus,
} from "../features/chat/chatThunks.js";
import {
  setMessages,
  setTypingUsers,
  setFilter,
  markAsRead,
  clearError,
} from "../features/chat/chatSlice.js";
import chatService from "../services/chatService.js";

export const useChat = (classroomId) => {
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  // Subscribe to messages
  useEffect(() => {
    if (!classroomId) return;

    const unsubscribe = chatService.subscribeToMessages(
      classroomId,
      (messages) => {
        dispatch(setMessages(messages));
      }
    );

    return () => unsubscribe();
  }, [classroomId, dispatch]);

  // Subscribe to typing users
  useEffect(() => {
    if (!classroomId || !user) return;

    const unsubscribe = chatService.subscribeToTypingUsers(
      classroomId,
      user.uid,
      (typingUsers) => {
        dispatch(setTypingUsers(typingUsers));
      }
    );

    return () => unsubscribe();
  }, [classroomId, user, dispatch]);

  const sendChatMessage = useCallback(
    (message, type = "text") => {
      if (!user || !message.trim()) return;

      return dispatch(
        sendMessage({
          classroomId,
          message: message.trim(),
          userId: user.uid,
          userName: user.email?.split("@")[0] || "User",
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          type,
        })
      );
    },
    [dispatch, classroomId, user]
  );

  const shareFileMessage = useCallback(
    (fileData) => {
      if (!user) return;

      return dispatch(
        shareFile({
          classroomId,
          fileData,
          userId: user.uid,
          userName: user.email?.split("@")[0] || "User",
          displayName: user.displayName || user.email?.split("@")[0] || "User",
        })
      );
    },
    [dispatch, classroomId, user]
  );

  const setUserTyping = useCallback(
    (isTyping) => {
      if (!user) return;

      return dispatch(
        setTypingStatus({
          classroomId,
          userId: user.uid,
          userName: user.displayName,
          isTyping,
        })
      );
    },
    [dispatch, classroomId, user]
  );

  const setMessageFilter = useCallback(
    (filter) => {
      dispatch(setFilter(filter));
    },
    [dispatch]
  );

  const markMessagesAsRead = useCallback(() => {
    dispatch(markAsRead());
  }, [dispatch]);

  const clearChatError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get filtered messages based on current filter
  const getFilteredMessages = useCallback(() => {
    const { messages, filter } = chatState;

    switch (filter) {
      case "questions":
        return messages.filter(
          (msg) =>
            msg.text.includes("?") ||
            msg.text.toLowerCase().includes("question")
        );
      case "files":
        return messages.filter((msg) => msg.type === "file");
      default:
        return messages;
    }
  }, [chatState]);

  return {
    ...chatState,
    sendMessage: sendChatMessage,
    shareFile: shareFileMessage,
    setTyping: setUserTyping,
    setFilter: setMessageFilter,
    markAsRead: markMessagesAsRead,
    clearError: clearChatError,
    getFilteredMessages,
  };
};

export default useChat;
