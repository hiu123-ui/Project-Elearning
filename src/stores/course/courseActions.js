// stores/course/courseActions.js
import { updateEnrollmentStatusAction, setEnrolledCoursesAction } from './index';
import { LocalStorage, keyLocalStorage } from '../../ultil/localStorage';
import { courseService } from '../../service/courseService';

export const enrollCourseAction = (maKhoaHoc) => {
  return async (dispatch, getState) => {
    try {
      const userInfo = LocalStorage.get(keyLocalStorage.INFO_USER);
      
      if (!userInfo || !userInfo.taiKhoan) {
        throw new Error('Vui lòng đăng nhập để đăng ký khóa học');
      }

      const data = {
        maKhoaHoc: maKhoaHoc,
        taiKhoan: userInfo.taiKhoan
      };

      console.log('🔄 Đang đăng ký khóa học với data:', data);

      // Gọi API đăng ký
      const response = await courseService.enrollCourse(data);
      
      console.log('📨 Response từ API đăng ký:', response);
      
      if (response.status === 200) {
        console.log('✅ Đăng ký thành công:', response.data);
        
        // Cập nhật trạng thái thành công
        dispatch(updateEnrollmentStatusAction({
          courseId: maKhoaHoc,
          status: 'enrolled'
        }));
        
        // Fetch lại thông tin user để cập nhật khóa học đã đăng ký
        await dispatch(fetchUserInfoWithCourses());
        
        return { 
          success: true, 
          data: response.data,
          message: 'Đăng ký khóa học thành công!' 
        };
      }
    } catch (error) {
      console.error('❌ Lỗi đăng ký khóa học:', error);
      console.error('❌ Chi tiết lỗi:', error.response?.data);
      
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Bạn đã đăng ký khóa học này trước đó.';
        } else if (error.response.status === 401) {
          errorMessage = 'Vui lòng đăng nhập để đăng ký khóa học.';
        } else if (error.response.data) {
          errorMessage = error.response.data.content || error.response.data.message || 'Đăng ký thất bại';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };
};

// Action mới: Lấy thông tin user bao gồm khóa học đã đăng ký
export const fetchUserInfoWithCourses = () => {
  return async (dispatch) => {
    try {
      console.log('🔄 Đang fetch thông tin user với khóa học...');
      const response = await courseService.getUserInfo();
      
      console.log('📚 API Response từ ThongTinTaiKhoan:', response);
      console.log('📚 User info với courses:', response.data);
      
      if (response.data && response.data.chiTietKhoaHocGhiDanh) {
        // Lấy danh sách khóa học từ thông tin user
        const enrolledCourses = response.data.chiTietKhoaHocGhiDanh;
        console.log(`✅ Lấy được ${enrolledCourses.length} khóa học từ user info`);
        dispatch(setEnrolledCoursesAction(enrolledCourses));
        
        // Cập nhật thông tin user trong localStorage nếu cần
        const currentUserInfo = LocalStorage.get(keyLocalStorage.INFO_USER);
        if (currentUserInfo) {
          const updatedUserInfo = {
            ...currentUserInfo,
            chiTietKhoaHocGhiDanh: enrolledCourses
          };
          LocalStorage.set(keyLocalStorage.INFO_USER, updatedUserInfo);
        }
      } else {
        console.log('⚠️ Không tìm thấy khóa học trong user info');
        dispatch(setEnrolledCoursesAction([]));
      }
    } catch (error) {
      console.error('❌ Lỗi lấy thông tin user:', error);
      console.error('❌ Error response:', error.response?.data);
      dispatch(setEnrolledCoursesAction([]));
    }
  };
};

// Fetch enrolled courses - sử dụng user info
export const fetchEnrolledCourses = () => {
  return async (dispatch) => {
    await dispatch(fetchUserInfoWithCourses());
  };
};

// Action kiểm tra trạng thái đăng ký
export const checkEnrollmentStatus = (maKhoaHoc) => {
  return async (dispatch, getState) => {
    try {
      const userInfo = LocalStorage.get(keyLocalStorage.INFO_USER);
      
      if (!userInfo || !userInfo.taiKhoan) {
        return;
      }

      // Kiểm tra trong danh sách khóa học đã đăng ký của user
      const { enrolledCourses } = getState().courseSlice;
      
      if (enrolledCourses && enrolledCourses.length > 0) {
        const isEnrolled = enrolledCourses.some(course => 
          course.maKhoaHoc === maKhoaHoc
        );
        
        dispatch(updateEnrollmentStatusAction({
          courseId: maKhoaHoc,
          status: isEnrolled ? 'enrolled' : 'not_enrolled'
        }));
        
        console.log(`🔍 Kiểm tra đăng ký: ${maKhoaHoc} - ${isEnrolled ? 'Đã đăng ký' : 'Chưa đăng ký'}`);
        return;
      }

      // Nếu chưa có enrolledCourses, fetch lại
      await dispatch(fetchUserInfoWithCourses());
      
    } catch (error) {
      console.error('❌ Lỗi kiểm tra trạng thái đăng ký:', error);
    }
  };
};

// Action hủy đăng ký khóa học
export const unenrollCourseAction = (maKhoaHoc) => {
  return async (dispatch) => {
    try {
      const userInfo = LocalStorage.get(keyLocalStorage.INFO_USER);
      
      if (!userInfo || !userInfo.taiKhoan) {
        throw new Error('Vui lòng đăng nhập để hủy đăng ký khóa học');
      }

      const data = {
        maKhoaHoc: maKhoaHoc,
        taiKhoan: userInfo.taiKhoan
      };

      console.log('🔄 Đang hủy đăng ký khóa học với data:', data);

      const response = await courseService.unenrollCourse(data);
      
      if (response.status === 200) {
        console.log('✅ Hủy đăng ký thành công:', response.data);
        
        // Cập nhật trạng thái
        dispatch(updateEnrollmentStatusAction({
          courseId: maKhoaHoc,
          status: 'not_enrolled'
        }));
        
        // Fetch lại thông tin user
        await dispatch(fetchUserInfoWithCourses());
        
        return { 
          success: true, 
          data: response.data,
          message: 'Hủy đăng ký khóa học thành công!' 
        };
      }
    } catch (error) {
      console.error('❌ Lỗi hủy đăng ký khóa học:', error);
      
      let errorMessage = 'Hủy đăng ký thất bại. Vui lòng thử lại.';
      
      if (error.response?.data) {
        errorMessage = error.response.data.content || error.response.data.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };
};