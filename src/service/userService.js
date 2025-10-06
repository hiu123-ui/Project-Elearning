import { axiosCustom } from "./config";

export const userService = {
    login: (infoUser) => {
        return axiosCustom.post('/QuanLyNguoiDung/DangNhap', infoUser);
    },

    register: (registerData) => {
        const formattedData = {
            taiKhoan: registerData.taiKhoan,
            matKhau: registerData.matKhau,
            hoTen: registerData.hoTen,
            soDT: registerData.soDT,
            maNhom: registerData.maNhom || "GP01",
            email: registerData.email
        };

        return axiosCustom.post('/QuanLyNguoiDung/DangKy', formattedData);
    },

    getUserInfo: () => {
        return axiosCustom.post('/QuanLyNguoiDung/ThongTinNguoiDung');
    },

    // Cập nhật service với xử lý lỗi chi tiết
    updateUserInfo: async (userInfo) => {
        try {
            const formattedData = {
                taiKhoan: userInfo.taiKhoan,
                matKhau: userInfo.matKhau || '', // Có thể để trống nếu không đổi
                hoTen: userInfo.hoTen,
                soDT: userInfo.soDT,
                maNhom: userInfo.maNhom,
                email: userInfo.email,
                maLoaiNguoiDung: userInfo.maLoaiNguoiDung
            };

            const response = await axiosCustom.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', formattedData);
            
            // Thêm token vào response nếu cần
            if (response.data && !response.data.accessToken) {
                response.data.accessToken = userInfo.accessToken;
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

    // Thêm hàm kiểm tra tài khoản tồn tại
    checkAccountExists: (taiKhoan) => {
        return axiosCustom.get(`/QuanLyNguoiDung/TimKiemNguoiDung?tuKhoa=${taiKhoan}`);
    },

    // Thêm hàm đổi mật khẩu riêng
    changePassword: (passwordData) => {
        return axiosCustom.put('/QuanLyNguoiDung/DoiMatKhau', passwordData);
    }
};