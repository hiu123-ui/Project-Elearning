// service/courseService.js
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
    
    searchCourses: (searchTerm) => {
        return axiosCustom.get(`/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01&tenKhoaHoc=${encodeURIComponent(searchTerm)}`);
    },
    
    // Đăng ký khóa học
    enrollCourse: (data) => {
        return axiosCustom.post('/QuanLyKhoaHoc/DangKyKhoaHoc', data);
    },

    // Hủy ghi danh
    unenrollCourse: (data) => {
        return axiosCustom.post('/QuanLyKhoaHoc/HuyGhiDanh', data);
    },

    // Kiểm tra ghi danh
    checkEnrollment: (maKhoaHoc, taiKhoan) => {
        return axiosCustom.post('/QuanLyKhoaHoc/KiemTraGhiDanh', { 
            maKhoaHoc, 
            taiKhoan 
        });
    },
    

    getEnrolledCourses: (taiKhoan) => {
        return axiosCustom.post('/QuanLyNguoiDung/LayDanhSachKhoaHocDaGhiDanh', {
            taiKhoan: taiKhoan
        });
    },
    

    getUserInfo: () => {
        return axiosCustom.post('/QuanLyNguoiDung/ThongTinTaiKhoan');
    }
}