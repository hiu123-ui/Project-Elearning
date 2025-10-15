// service/courseService.js
import { axiosCustom } from "./config";

export const courseService = {
    getListCourse: () => {
        return axiosCustom.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc?MaNhom=GP01');
    },
    getCourseDetail: (courseID) => {
        return axiosCustom.get(`/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${courseID}`);
    },
    // getCategoryByID
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
    },

    // get api for admin
    getListCoursePagination: (page) => axiosCustom.get("/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang", {
        params: {
            page,
            pageSize: 10,
            MaNhom: "GP01",
        },
    }),
    getCategorySelect: () => axiosCustom.get("/QuanLyKhoaHoc/LayDanhMucKhoaHoc"),
    addCourse: (courceData) => axiosCustom.post("/QuanLyKhoaHoc/ThemKhoaHoc", courceData),
    uploadCourseImage: (tenKhoaHoc, maNhom, file) => {
        const formData = new FormData();
        formData.append("file", file);

        return axiosCustom.post(
            `/QuanLyKhoaHoc?tenKhoaHoc=${encodeURIComponent(tenKhoaHoc)}&maNhom=${maNhom}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
    },

    addCourseWithImage: async (payload, file) => {
        await courseService.addCourse(payload);
        if (file) {
            await courseService.uploadCourseImage(payload.tenKhoaHoc, payload.maNhom, file);
        }

        return true;
    },
}