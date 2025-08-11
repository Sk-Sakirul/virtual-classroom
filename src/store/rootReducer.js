import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice.js";
import chatSlice from "../features/chat/chatSlice.js";
import whiteboardSlice from "../features/whiteboard/whiteboardSlice.js";
import filesSlice from "../features/files/fileSlice.js";
import videoSlice from "../features/video/videoSlice.js";
// import participationSlice from "../features/participation/participationSlice.js";

const rootReducer = combineReducers({
  auth: authSlice,
  chat: chatSlice,
  whiteboard: whiteboardSlice,
  files: filesSlice,
  video: videoSlice,
//   participation: participationSlice,
});

export default rootReducer;
