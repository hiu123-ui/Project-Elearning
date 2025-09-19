import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  listCourse: [],
 
}

const courseSlice = createSlice({
  name: "courseSlice",
  initialState,
  reducers: {
    setListCourseAction: (state, action) => {

      state.listCourse = action.payload;
    }
  }
});

export const {setListCourseAction} = courseSlice.actions;


export default courseSlice.reducer;