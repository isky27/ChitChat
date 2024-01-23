import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
    isAuthLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
    loginDetails: JSON.parse(localStorage.getItem("userInfo")) || null
}

// Async Thunk for fetching data from an API
export const authLoginPost = createAsyncThunk('auth/login',
    async (userData) => {
        try {
            const { data } = await axios.post('/user/login', userData);
            localStorage.setItem("userInfo", JSON.stringify(data));
            toast.success("Login Successful");
            return data;
        } catch (error) {
            toast.error("Error Occured!");
        }

    }
);

export const authSignupPost = createAsyncThunk('auth/signup',
    async (userData) => {
        try {
            const {data} = await axios.post('/user', userData);
            toast.success("Registration Successful")
            localStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        } catch (error) {
            toast.error("Error Occured!");
        }
    }
);

export const authReducer = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        resetAuth: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(authLoginPost.pending, state => {
                state.isAuthLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.loginDetails = null;
            })
            .addCase(authLoginPost.fulfilled, (state, action) => {
                state.isAuthLoading = false;
                state.isSuccess = true;
                state.loginDetails = action.payload;
            })
            .addCase(authLoginPost.rejected, state => {
                state.isAuthLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.loginDetails = null;
            })
            .addCase(authSignupPost.pending, state => {
                state.isAuthLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.loginDetails = null;
            })
            .addCase(authSignupPost.fulfilled, (state, action) => {
                state.isAuthLoading = false;
                state.isSuccess = true;
                state.loginDetails = action.payload;
            })
            .addCase(authSignupPost.rejected, state => {
                state.isAuthLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.loginDetails = null;
            })
    },
});

export const { resetAuth } = authReducer.actions;
export default authReducer.reducer;

