import { createSlice } from "@reduxjs/toolkit"
import { fetchMessages, sendMessage } from "./chatThunks";


const initialState = {
    messages: [],
    loading: false,
    error: null,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers : {
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchMessages.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.messages = action.payload;
          })
          .addCase(fetchMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(sendMessage.fulfilled, (state, action) => {
            state.messages.push(action.payload);
          })
    }
})


export const {clearMessages} = chatSlice.actions;
export default chatSlice.reducer;