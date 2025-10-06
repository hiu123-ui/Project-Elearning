// stores/course/index.js
import { createSlice } from '@reduxjs/toolkit'
import { LocalStorage, keyLocalStorage } from '../../ultil/localStorage';

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
    },
     setInfoUser: (state, action) => {
      state.infoUser = action.payload;
      LocalStorage.set(keyLocalStorage.INFO_USER, action.payload);
    },
    // THÊM ACTION MỚI: Cập nhật thông tin user với khóa học
    updateUserCourses: (state, action) => {
      if (state.infoUser) {
        state.infoUser = { ...state.infoUser, ...action.payload };
        LocalStorage.set(keyLocalStorage.INFO_USER, state.infoUser);
      }
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.infoUser = null;
      LocalStorage.remove(keyLocalStorage.INFO_USER);
    }
  }
});

export const { 
  setListCourseAction, 
  setCategoryAction, 
  updateUserCourses,
  setCoursesByCategoryAction, 
  setSearchResultsAction,
  setEnrollmentStatusAction,
  setEnrolledCoursesAction,
  updateEnrollmentStatusAction // THÊM DÒNG NÀY
} = courseSlice.actions;

export default courseSlice.reducer;