import { axiosCustom } from "./config";

export const userService = {
    login: async (infoUser) => {
        try {
            const response = await axiosCustom.post('/QuanLyNguoiDung/DangNhap', infoUser);
            return response;
        } catch (error) {
            // Xử lý lỗi chi tiết hơn
            if (error.response) {
                const serverError = error.response.data;
                throw new Error(serverError.content || serverError.message || 'Đăng nhập thất bại');
            } else if (error.request) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            } else {
                throw new Error('Đã xảy ra lỗi không xác định.');
            }
        }
    },

    register: async (registerData) => {
        try {
            const formattedData = {
                taiKhoan: registerData.taiKhoan,
                matKhau: registerData.matKhau,
                hoTen: registerData.hoTen,
                soDT: registerData.soDT,
                maNhom: registerData.maNhom || "GP01",
                email: registerData.email
            };

            const response = await axiosCustom.post('/QuanLyNguoiDung/DangKy', formattedData);
            return response;
        } catch (error) {
            // Xử lý lỗi chi tiết hơn
            if (error.response) {
                const serverError = error.response.data;
                throw new Error(serverError.content || serverError.message || 'Đăng ký thất bại');
            } else if (error.request) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            } else {
                throw new Error('Đã xảy ra lỗi không xác định.');
            }
        }
    },

    getUserInfo: () => {
        return axiosCustom.post('/QuanLyNguoiDung/ThongTinNguoiDung');
    },

    // Cập nhật service với xử lý lỗi chi tiết và chuẩn hóa dữ liệu
    updateUserInfo: async (userInfo) => {
        try {
            // Chuẩn hóa dữ liệu trước khi gửi lên server
            const formattedData = {
                taiKhoan: userInfo.taiKhoan,
                matKhau: userInfo.matKhau || '', // Có thể để trống nếu không đổi
                hoTen: userInfo.hoTen.trim(),
                soDT: userInfo.soDT.trim(), // Đảm bảo cắt bỏ khoảng trắng
                maNhom: userInfo.maNhom,
                email: userInfo.email.trim(),
                maLoaiNguoiDung: userInfo.maLoaiNguoiDung
            };

            const response = await axiosCustom.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', formattedData);

            // Thêm token vào response nếu cần
            if (response.data && !response.data.accessToken) {
                response.data.accessToken = userInfo.accessToken;
            }

            // Đảm bảo dữ liệu trả về đã được chuẩn hóa
            if (response.data) {
                response.data.soDT = response.data.soDT?.trim() || '';
                response.data.hoTen = response.data.hoTen?.trim() || '';
                response.data.email = response.data.email?.trim() || '';
            }

            return response;
        } catch (error) {
            // Xử lý lỗi chi tiết
            const errorMessage = error.response?.data?.content ||
                error.response?.data?.message ||
                'Cập nhật thất bại. Vui lòng thử lại.';
            throw new Error(errorMessage);
        }
    },
    addUser: (userData) => {
        return axiosCustom.post('QuanLyNguoiDung/ThemNguoiDung', userData);
    },
    getListUserPagination: (page) => axiosCustom.get("/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang", {
        params: {
            page,
            pageSize: 10,
            MaNhom: "GP01",
        },
    }),
    getListUser: () => {
        return axiosCustom.get('/QuanLyNguoiDung/LayDanhSachNguoiDung');
    },
    getListMaLoaiNguoiDung: () => {
        return axiosCustom.get('/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung');
    },
    updateUser: (data) => {
        return axiosCustom.put(`/QuanLyNguoiDung/CapNhatThongTinNguoiDung`, data);
    },
    deleteUser: (userID) => {
        return axiosCustom.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${userID}`);
    },
    searchUser: (keyword) => {
        return axiosCustom.get(`/QuanLyNguoiDung/TimKiemNguoiDung`, {
            params: {
                tuKhoa: keyword,
                MaNhom: "GP01",  // Giá trị mặc định
            },
        });
    },

};