// stores/course/courseActions.js
import { updateEnrollmentStatusAction, setEnrolledCoursesAction } from './index';
import { LocalStorage, keyLocalStorage } from '../../ultil/localStorage';
import { courseService } from '../../service/courseService';

export const enrollCourseAction = (maKhoaHoc) => {
  return async (dispatch) => {
    try {
      // Lấy thông tin user từ localStorage
      const userInfo = LocalStorage.get(keyLocalStorage.INFO_USER);
      
      if (!userInfo || !userInfo.taiKhoan) {
        throw new Error('Vui lòng đăng nhập để đăng ký khóa học');
      }

      const data = {
        maKhoaHoc: maKhoaHoc,
        taiKhoan: userInfo.taiKhoan
      };

      console.log('🔄 Đang đăng ký khóa học:', data);

      // Gọi API đăng ký
      const response = await courseService.enrollCourse(data);
      
      if (response.status === 200) {
        console.log('✅ Đăng ký thành công:', response.data);
        
        // Cập nhật trạng thái thành công
        dispatch(updateEnrollmentStatusAction({
          courseId: maKhoaHoc,
          status: 'enrolled'
        }));
        
        // Cập nhật danh sách khóa học đã đăng ký
        await dispatch(fetchEnrolledCourses());
        
        return { 
          success: true, 
          data: response.data,
          message: 'Đăng ký khóa học thành công!' 
        };
      }
    } catch (error) {
      console.error('❌ Lỗi đăng ký khóa học:', error);
      
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Bạn đã đăng ký khóa học này trước đó.';
        } else if (error.response.status === 401) {
          errorMessage = 'Vui lòng đăng nhập để đăng ký khóa học.';
        } else if (error.response.data && error.response.data.content) {
          errorMessage = error.response.data.content;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Cập nhật trạng thái thất bại
      dispatch(updateEnrollmentStatusAction({
        courseId: maKhoaHoc,
        status: 'error'
      }));
      
      throw new Error(errorMessage); // Ném lỗi để component bắt
    }
  };
};

// Fetch enrolled courses - CẢI TIẾN
// Action lấy danh sách khóa học đã đăng ký
export const fetchEnrolledCourses = () => {
  return async (dispatch) => {
    const userInfo = LocalStorage.get(keyLocalStorage.INFO_USER);
    if (!userInfo || !userInfo.taiKhoan) {
      dispatch(setEnrolledCoursesAction([]));
      return;
    }
    try {
      const response = await courseService.getEnrolledCourses(userInfo.taiKhoan);
      if (response.data && Array.isArray(response.data)) {
        dispatch(setEnrolledCoursesAction(response.data));
      } else {
        dispatch(setEnrolledCoursesAction([]));
      }
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách khóa học đã đăng ký:', error);
      dispatch(setEnrolledCoursesAction([]));
    }
  };
};

// Action kiểm tra trạng thái đăng ký
export const checkEnrollmentStatus = (maKhoaHoc) => {
  return async (dispatch) => {
    try {
      const userInfo = LocalStorage.get(keyLocalStorage.INFO_USER);
      
      if (!userInfo || !userInfo.taiKhoan) {
        return;
      }

      const response = await courseService.checkEnrollment(maKhoaHoc, userInfo.taiKhoan);
      
      dispatch(updateEnrollmentStatusAction({
        courseId: maKhoaHoc,
        status: response.data ? 'enrolled' : 'not_enrolled'
      }));
    } catch (error) {
      console.error('❌ Lỗi kiểm tra trạng thái đăng ký:', error);
    }
  };
};