import { axiosCustom } from "./config";

export const courseService = {
    getListCourse: () => {
        return axiosCustom.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01');
    },
    getCourseDetail: (courseID) => {
        return axiosCustom.get(`/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${courseID}`);
    },
    getCategory: (categoryID = "") => {
        return axiosCustom.get(`/QuanLyKhoaHoc/LayDanhMucKhoaHoc?tenDanhMuc=${categoryID}`);
    },
    getCoursesByCategory: (maDanhMuc, maNhom) => {
        return axiosCustom.get(`/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${maDanhMuc}&MaNhom=${maNhom}`);
    },
    // Thêm hàm search courses
    searchCourses: (searchTerm) => {
        return axiosCustom.get(`/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01&tenKhoaHoc=${encodeURIComponent(searchTerm)}`);
    },
    // courseService.js - cập nhật hàm enrollCourse
    enrollCourse: (data) => {
        return axiosCustom.post('/QuanLyKhoaHoc/DangKyKhoaHoc', data);
    },

    // Thêm hàm hủy đăng ký (nếu cần)
    unenrollCourse: (data) => {
        return axiosCustom.post('/QuanLyKhoaHoc/HuyGhiDanh', data);
    },

    // Thêm hàm kiểm tra trạng thái đăng ký
    checkEnrollment: (maKhoaHoc, taiKhoan) => {
        return axiosCustom.post('/QuanLyKhoaHoc/KiemTraGhiDanh', { maKhoaHoc, taiKhoan });
    },
    enrollCourse: (data) => {
        return axiosCustom.post('/QuanLyKhoaHoc/DangKyKhoaHoc', data);
    },
    
    checkEnrollment: (maKhoaHoc, taiKhoan) => {
        return axiosCustom.post('/QuanLyKhoaHoc/KiemTraGhiDanh', { 
            maKhoaHoc, 
            taiKhoan 
        });
    },
     // THÊM HÀM NÀY: Lấy danh sách khóa học đã đăng ký
    getEnrolledCourses: (taiKhoan) => {
        // API lấy danh sách khóa học đã ghi danh cho user
        return axiosCustom.post('/QuanLyNguoiDung/LayDanhSachKhoaHocDaGhiDanh', {
            taiKhoan: taiKhoan
        });
    },
    
    // Hoặc nếu API khác, sử dụng hàm này:
    getCoursesByUser: (taiKhoan) => {
        return axiosCustom.post('/QuanLyNguoiDung/LayDanhSachKhoaHocDaGhiDanh', {
            taiKhoan: taiKhoan
        });
    },
    
    enrollCourse: (data) => {
        return axiosCustom.post('/QuanLyKhoaHoc/DangKyKhoaHoc', data);
    },
    
    checkEnrollment: (maKhoaHoc, taiKhoan) => {
        return axiosCustom.post('/QuanLyKhoaHoc/KiemTraGhiDanh', { 
            maKhoaHoc, 
            taiKhoan 
        });
    }

}