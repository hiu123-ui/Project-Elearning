import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearRegisterSuccess } from "../../stores/user";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, registerSuccess } = useSelector((state) => state.userSlice);
  
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    soDT: "",
    maNhom: "GP01",
    email: ""
  });

  // Xử lý chuyển hướng sau khi đăng ký thành công
  useEffect(() => {
    if (registerSuccess) {
      toast.success("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
      
      const timer = setTimeout(() => {
        navigate("/login");
        dispatch(clearRegisterSuccess());
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [registerSuccess, navigate, dispatch]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Xác thực form chi tiết hơn
  const validateForm = () => {
    const errors = {};
    
    // Validate tài khoản
    if (!formData.taiKhoan.trim()) {
      errors.taiKhoan = "Tài khoản không được để trống";
    } else if (formData.taiKhoan.length < 4) {
      errors.taiKhoan = "Tài khoản phải có ít nhất 4 ký tự";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.taiKhoan)) {
      errors.taiKhoan = "Tài khoản chỉ được chứa chữ cái và số";
    }
    
    // Validate mật khẩu
    if (!formData.matKhau) {
      errors.matKhau = "Mật khẩu không được để trống";
    } else if (formData.matKhau.length < 6) {
      errors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.matKhau)) {
      errors.matKhau = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
    }
    
    // Validate họ tên
    if (!formData.hoTen.trim()) {
      errors.hoTen = "Họ tên không được để trống";
    } else if (formData.hoTen.length < 2) {
      errors.hoTen = "Họ tên phải có ít nhất 2 ký tự";
    }
    
    // Validate số điện thoại
    if (!formData.soDT) {
      errors.soDT = "Số điện thoại không được để trống";
    } else if (!/^[0-9]+$/.test(formData.soDT)) {
      errors.soDT = "Số điện thoại chỉ được chứa số";
    } else if (formData.soDT.length < 10) {
      errors.soDT = "Số điện thoại phải có ít nhất 10 số";
    }
    
    // Validate email
    if (!formData.email) {
      errors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(registerUser(formData));
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      soDT: "",
      maNhom: "GP01",
      email: ""
    });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative overflow-hidden px-4 py-8">
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-purple-400/30 blur-3xl" />

      {/* Form card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          <p className="text-gray-600 mt-2">Tạo tài khoản để bắt đầu sử dụng dịch vụ</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Tài khoản */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tài khoản *
            </label>
            <input
              type="text"
              name="taiKhoan"
              value={formData.taiKhoan}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                formErrors.taiKhoan 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
              placeholder="Nhập tài khoản (4-20 ký tự)"
            />
            {formErrors.taiKhoan && (
              <p className="text-red-500 text-xs mt-1">{formErrors.taiKhoan}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="matKhau"
              value={formData.matKhau}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                formErrors.matKhau 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            />
            {formErrors.matKhau && (
              <p className="text-red-500 text-xs mt-1">{formErrors.matKhau}</p>
            )}
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên *
            </label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                formErrors.hoTen 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
              placeholder="Nhập họ tên đầy đủ"
            />
            {formErrors.hoTen && (
              <p className="text-red-500 text-xs mt-1">{formErrors.hoTen}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="soDT"
              value={formData.soDT}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                formErrors.soDT 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
              placeholder="Nhập số điện thoại"
            />
            {formErrors.soDT && (
              <p className="text-red-500 text-xs mt-1">{formErrors.soDT}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                formErrors.email 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
              placeholder="Nhập địa chỉ email"
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Mã nhóm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã nhóm
            </label>
            <select
              name="maNhom"
              value={formData.maNhom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="GP01">GP01</option>
              <option value="GP02">GP02</option>
              <option value="GP03">GP03</option>
              <option value="GP04">GP04</option>
              <option value="GP05">GP05</option>
              <option value="GP06">GP06</option>
              <option value="GP07">GP07</option>
              <option value="GP08">GP08</option>
              <option value="GP09">GP09</option>
              <option value="GP10">GP10</option>
            </select>
          </div>

          {/* Hiển thị lỗi từ API */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Nút hành động */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition"
            >
              Làm mới
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>
          </div>
        </form>

        {/* Link chuyển hướng */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;