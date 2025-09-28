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
    
    updateUserInfo: (userInfo) => {
        return axiosCustom.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', userInfo);
    },
    
    // Thêm hàm kiểm tra tài khoản tồn tại
    checkAccountExists: (taiKhoan) => {
        return axiosCustom.get(`/QuanLyNguoiDung/TimKiemNguoiDung?tuKhoa=${taiKhoan}`);
    }
};