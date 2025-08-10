import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  typingUsers: [],
  filter: "all", // 'all', 'questions', 'files'
  isLoading: false,
  error: null,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.isLoading = false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.unreadCount += 1;
    },
    setTypingUsers: (state, action) => {
      state.typingUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      const existingUser = state.typingUsers.find(
        (user) => user.userId === action.payload.userId
      );
      if (!existingUser) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        (user) => user.userId !== action.payload
      );
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
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
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.typingUsers = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  setFilter,
  setLoading,
  setError,
  clearError,
  markAsRead,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
