import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../config/ChatLogics';

const initialState = {
    isChatLoading:false,
    isAccessChatLoading: false,
    myChats: [],
    selectedChat:"",
    isSuccess: false,
    isError: false,
    message: "",
}

// Async Thunk for fetching data from an API
export const getChats = createAsyncThunk('chat/chats',
    async () => {
        try {
            const { data } = await axios.get('/chat', getConfig());
            return data;
        } catch (error) {
            toast.error("Error Occured!", {
                description: "Failed to Load the chats.", // Add a description to the toast
            });
        }
    }
);

export const accessChat = createAsyncThunk('chat/accessChat',
    async (userId) => {
        try {
            const { data } = await axios.post('/chat', { userId }, getConfig());
            return data;
        } catch (error) {
            toast.error("Error Occured!",{
                description:error.message
            });
        }
    }
);

export const createGroupChat = createAsyncThunk('chat/createGroup',
    async (userData) => {
        try {
            const { data } = await axios.post('/chat/group', userData, getConfig());
            toast.success("New Group Chat Created!")
            return data;
        } catch (error) {
            toast.error("Failed to Create the Chat!", {
                description: error.response.data,
            });
        }
    }
);

export const setSelectedChat = createAsyncThunk('chat/select/chat', async (chat) => {
    return chat
})

export const chatReducer = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        resetChat: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChats.pending, state => {
                state.isChatLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(getChats.fulfilled, (state, action) => {
                state.isChatLoading = false;
                state.isSuccess = true;
                state.myChats = action.payload;
            })
            .addCase(getChats.rejected, state => {
                state.isChatLoading = false;
                state.isSuccess = false;
                state.isError = true;
            })
            .addCase(accessChat.pending, state => {
                state.isAccessChatLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                state.isAccessChatLoading = false;
                state.isSuccess = true;
                state.selectedChat = action.payload;
                if (!state?.myChats.find((c) => c._id === action.payload._id)){
                    state.myChats = [action.payload].concat(state.myChats);
                }
            })
            .addCase(accessChat.rejected, state => {
                state.isAccessChatLoading = false;
                state.isSuccess = false;
                state.isError = true;
            })
            .addCase(createGroupChat.pending, state => {
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(createGroupChat.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.myChats = [action.payload].concat(state.myChats);
            })
            .addCase(createGroupChat.rejected, state => {
                state.isSuccess = false;
                state.isError = true;
            })
            .addCase(setSelectedChat.fulfilled, (state, action) => {
                state.selectedChat = action.payload
            })
    },
});

export const { resetChat } = chatReducer.actions;
export default chatReducer.reducer;

