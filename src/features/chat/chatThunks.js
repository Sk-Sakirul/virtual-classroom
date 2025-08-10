// import { createAsyncThunk } from "@reduxjs/toolkit";
// import chatService from "../../services/chatService";
// import { Timestamp } from "firebase/firestore"; // Correct Firebase timestamp

// // Fetch all messages
// export const fetchMessages = createAsyncThunk(
//   "chat/fetchMessages",
//   async (_, thunkAPI) => {
//     try {
//       const messages = await chatService.getMessages();
//       return messages;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// // Send a new message with server timestamp
// export const sendMessage = createAsyncThunk(
//   "chat/sendMessage",
//   async (messageData, thunkAPI) => {
//     try {
//       const newMsg = {
//         ...messageData,
//         createdAt: new Date().toISOString(), // ✅ Make serializable
//       };
//       const savedMsg = await chatService.sendMessage(newMsg);
//       return savedMsg;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );


// // Set typing status
// export const setTypingStatus = createAsyncThunk(
//   "chat/setTypingStatus",
//   async ({ username, isTyping }, thunkAPI) => {
//     try {
//       await chatService.setTypingStatus(username, isTyping);
//       return { username, isTyping };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );


import { createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "../../services/chatService.js";
import { setError, setLoading } from "./chatSlice.js";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { classroomId, message, userId, userName, displayName, type },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await chatService.sendMessage(
        classroomId,
        message,
        userId,
        userName,
        displayName,
        type
      );
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const shareFile = createAsyncThunk(
  "chat/shareFile",
  async (
    { classroomId, fileData, userId, userName, displayName },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await chatService.shareFile(
        classroomId,
        fileData,
        userId,
        userName,
        displayName
      );
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const setTypingStatus = createAsyncThunk(
  "chat/setTypingStatus",
  async ({ classroomId, userId, userName, isTyping }, { dispatch }) => {
    try {
      await chatService.setTypingStatus(
        classroomId,
        userId,
        userName,
        isTyping
      );
    } catch (error) {
      console.error("Failed to set typing status:", error);
    }
  }
);

export const getMessagesByType = createAsyncThunk(
  "chat/getMessagesByType",
  async ({ classroomId, type }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const messages = await chatService.getMessagesByType(classroomId, type);
      return messages;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);
