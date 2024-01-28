import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../config/ChatLogics';

const initialState = {
    chatMessage:[],
    isLoadingMessage:false,
    isSuccess: false,
    isError: false,
    message: "",
}

// Async Thunk for fetching data from an API
export const getMessage = createAsyncThunk('get/messages',
    async (id) => {
        try {
            const { data } = await axios.get(`/message/${id}`,getConfig());
            return data;
        } catch (error) {
            toast.error("Error Occured!", {
                description: "Failed to Load the Messages"
            });
        }
    }
);

export const sendMessage = createAsyncThunk('post/messages',
    async (userData) => {
        try {
            const { data } = await axios.post(`/message`, userData?.message, getConfig());
            userData.socket.emit("new message", data);
            return data;
        } catch (error) {
            toast.error("Error Occured!", {
                description: "Failed to send the Message"
            });
        }
    }
);

export const setNewMessageReceived = createAsyncThunk('message/new/message', async (messages) => {
    return messages
})


export const messageReducer = createSlice({
    name: 'message',
    initialState,
    reducers: {
        resetMessage: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessage.pending, state => {
                state.isLoadingMessage = true;
                state.isSuccess = false;
                state.isError = false;
                state.chatMessage = [];
            })
            .addCase(getMessage.fulfilled, (state, action) => {
                state.isLoadingMessage = false;
                state.isSuccess = true;
                state.chatMessage = action.payload;
            })
            .addCase(getMessage.rejected, state => {
                state.isLoadingMessage = false;
                state.isSuccess = false;
                state.isError = true;
                state.chatMessage = [];
            })
            .addCase(sendMessage.pending, state => {
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.chatMessage = [...state.chatMessage,action.payload];

            })
            .addCase(sendMessage.rejected, state => {
                state.isSuccess = false;
                state.isError = true;
            })
            .addCase(setNewMessageReceived.fulfilled,(state,action)=>{
                state.chatMessage = action.payload;
            })
    },
});

export const { resetMessage } = messageReducer.actions;
export default messageReducer.reducer;

