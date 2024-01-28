import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth.slice'
import chatReducer from './chat.slice'
import userReducer from './user.slice'
import messageReducer from './message.slice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chats: chatReducer,
        user: userReducer,
        message: messageReducer
    },
})

export default store