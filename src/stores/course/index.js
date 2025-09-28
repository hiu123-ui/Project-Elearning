// stores/course/index.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  listCourse: [],
  category: [],
  coursesByCategory: [],
  searchResults: [],
  enrollmentStatus: {},
  enrolledCourses: []
}

const courseSlice = createSlice({
  name: "courseSlice",
  initialState,
  reducers: {
    setListCourseAction: (state, action) => {
      state.listCourse = action.payload;
    },
    setCategoryAction: (state, action) => {
      state.category = action.payload;
    },
    setCoursesByCategoryAction: (state, action) => {
      state.coursesByCategory = action.payload;
    },
    setSearchResultsAction: (state, action) => {
      state.searchResults = action.payload;
    },
    setEnrollmentStatusAction: (state, action) => {
      state.enrollmentStatus = action.payload;
    },
    setEnrolledCoursesAction: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    updateEnrollmentStatusAction: (state, action) => {
      const { courseId, status } = action.payload;
      state.enrollmentStatus[courseId] = status;
    }
  }
});

export const { 
  setListCourseAction, 
  setCategoryAction, 
  setCoursesByCategoryAction, 
  setSearchResultsAction,
  setEnrollmentStatusAction,
  setEnrolledCoursesAction,
  updateEnrollmentStatusAction // THÊM DÒNG NÀY
} = courseSlice.actions;

export default courseSlice.reducer;