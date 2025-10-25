import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearRegisterSuccess, clearError } from "../../stores/user";
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

  const [showError, setShowError] = useState(false);

  // Clear error khi component unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [error, dispatch]);

  // Hiển thị lỗi khi có error từ API
  useEffect(() => {
    if (error) {
      setShowError(true);
      // Tự động ẩn lỗi sau 5 giây
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    
    // Xóa lỗi từ API khi người dùng bắt đầu nhập
    if (error) {
      dispatch(clearError());
      setShowError(false);
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
    if (error) {
      dispatch(clearError());
      setShowError(false);
    }
  };

  // Xử lý đóng thông báo lỗi
  const handleCloseError = () => {
    setShowError(false);
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative overflow-hidden px-4 py-8">
      {/* Background decoration */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-purple-400/30 blur-3xl" />

      {/* Toast Error Notification */}
      {error && showError && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold">Lỗi đăng ký</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseError}
                className="text-white hover:text-gray-200 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className={`w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 relative z-10 transition-all duration-300 ${
        error && showError ? 'border-2 border-red-400 shadow-2xl shadow-red-200' : ''
      }`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold transition-colors ${
            error && showError ? 'text-red-600' : 'text-gray-800'
          }`}>
            Đăng ký tài khoản
          </h2>
          <p className="text-gray-600 mt-2">Tạo tài khoản để bắt đầu sử dụng dịch vụ</p>
          
          {/* Error badge trên tiêu đề */}
          {error && showError && (
            <div className="mt-2 inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Có lỗi xảy ra
            </div>
          )}
        </div>

        {/* Main Error Alert */}
        {error && showError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Không thể đăng ký
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseError}
                className="ml-auto pl-3"
              >
                <svg className="w-4 h-4 text-red-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

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
              className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                formErrors.taiKhoan 
                  ? "border-red-500 focus:ring-2 focus:ring-red-400 bg-red-50" 
                  : error && showError 
                  ? "border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
              }`}
              placeholder="Nhập tài khoản (4-20 ký tự)"
            />
            {formErrors.taiKhoan && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.taiKhoan}
              </p>
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
              className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                formErrors.matKhau 
                  ? "border-red-500 focus:ring-2 focus:ring-red-400 bg-red-50" 
                  : error && showError 
                  ? "border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
              }`}
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            />
            {formErrors.matKhau && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.matKhau}
              </p>
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
              className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                formErrors.hoTen 
                  ? "border-red-500 focus:ring-2 focus:ring-red-400 bg-red-50" 
                  : error && showError 
                  ? "border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
              }`}
              placeholder="Nhập họ tên đầy đủ"
            />
            {formErrors.hoTen && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.hoTen}
              </p>
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
              className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                formErrors.soDT 
                  ? "border-red-500 focus:ring-2 focus:ring-red-400 bg-red-50" 
                  : error && showError 
                  ? "border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
              }`}
              placeholder="Nhập số điện thoại"
            />
            {formErrors.soDT && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.soDT}
              </p>
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
              className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                formErrors.email 
                  ? "border-red-500 focus:ring-2 focus:ring-red-400 bg-red-50" 
                  : error && showError 
                  ? "border-orange-300 focus:ring-2 focus:ring-orange-400 bg-orange-50"
                  : "border-gray-300 focus:ring-2 focus:ring-indigo-400"
              }`}
              placeholder="Nhập địa chỉ email"
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {formErrors.email}
              </p>
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
              className={`w-full px-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error && showError 
                  ? "border-orange-300 focus:ring-orange-400 bg-orange-50" 
                  : "border-gray-300 focus:ring-indigo-400"
              }`}
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

          {/* Nút hành động */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-200"
            >
              Làm mới
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 font-semibold rounded-lg shadow-md transition-all duration-200 ${
                loading 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : error && showError
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
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
                <span className="flex items-center justify-center">
                  {error && showError ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thử lại
                    </>
                  ) : (
                    "Đăng ký"
                  )}
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Link chuyển hướng */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className={`hover:underline font-medium ${
              error && showError ? 'text-red-600' : 'text-indigo-600'
            }`}>
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Thêm CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;