import { createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "../../services/chatService";


export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async () => {
        const messages = await chatService.getMessages();
        return messages;
    }
)


export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (messageData) => {
        const newMsg = await chatService.sendMessage(messageData);
        return newMsg;
    }
)