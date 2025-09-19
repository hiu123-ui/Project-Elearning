import { configureStore } from "@reduxjs/toolkit";
import courseSlice from './course';

export const store = configureStore({
    reducer: {
        courseSlice: courseSlice
    }
});