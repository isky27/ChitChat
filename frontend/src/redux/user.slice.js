import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getConfig } from '../config/ChatLogics';

const initialState = {
    isUserSearchLoading:false,
    searchedUser:[],
    isSuccess: false,
    isError: false,
    message: "",
}

// Async Thunk for fetching data from an API
export const searchUser = createAsyncThunk('user/search/user',
    async (search) => {
        try {
            const { data } = await axios.get(`/user?search=${search}`, getConfig());
            return data;
        } catch (error) {
            toast.error("Error Occured!", {
                description: "Failed to Load the Search Results."
            });
        }
    }
);

export const userReducer = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetUsers: (state) => state=initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUser.pending, state => {
                state.isUserSearchLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.searchedUser = [];
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.isUserSearchLoading = false;
                state.isSuccess = true;
                state.searchedUser = action.payload;
            })
            .addCase(searchUser.rejected, state => {
                state.isUserSearchLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.searchedUser = [];
            })
    },
});

export const { resetUsers } = userReducer.actions;
export default userReducer.reducer;

