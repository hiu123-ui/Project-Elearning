import { configureStore } from "@reduxjs/toolkit";
import courseSlice from './course';
import userSlice from './user';

export const store = configureStore({
    reducer: {
        courseSlice: courseSlice,
        userSlice: userSlice,
    }
});