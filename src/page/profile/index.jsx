// ProfilePage/index.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo } from '../../stores/user';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { infoUser, updateLoading } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    taiKhoan: '',
    matKhau: '',
    hoTen: '',
    soDT: '',
    maNhom: 'GP01',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Khởi tạo form data từ thông tin user
  useEffect(() => {
    if (infoUser) {
      setFormData({
        taiKhoan: infoUser.taiKhoan || '',
        matKhau: '', // Để trống mật khẩu
        hoTen: infoUser.hoTen || '',
        soDT: infoUser.soDT || '',
        maNhom: infoUser.maNhom || 'GP01',
        email: infoUser.email || ''
      });
    }
  }, [infoUser]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = 'Họ tên không được để trống';
    } else if (formData.hoTen.trim().length < 2) {
      newErrors.hoTen = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.soDT.trim()) {
      newErrors.soDT = 'Số điện thoại không được để trống';
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.soDT)) {
      newErrors.soDT = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    }

    if (formData.matKhau && formData.matKhau.length < 6) {
      newErrors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (formData.matKhau && formData.matKhau.length > 20) {
      newErrors.matKhau = 'Mật khẩu không được quá 20 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('❌ Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      const updateData = {
        taiKhoan: formData.taiKhoan,
        hoTen: formData.hoTen.trim(),
        soDT: formData.soDT,
        maNhom: formData.maNhom,
        email: formData.email.trim(),
        maLoaiNguoiDung: infoUser.maLoaiNguoiDung,
        accessToken: infoUser.accessToken // QUAN TRỌNG: Giữ lại token
      };

      // Chỉ thêm mật khẩu nếu được cung cấp
      if (formData.matKhau.trim()) {
        updateData.matKhau = formData.matKhau;
      }

      await dispatch(updateUserInfo(updateData)).unwrap();
      
      // Reset form sau khi thành công
      setFormData(prev => ({ ...prev, matKhau: '' }));
      setIsEditing(false);
      setShowPassword(false);
      
    } catch (error) {
      console.error('Update error:', error);
      // Error đã được xử lý trong extraReducers
    }
  };

  const handleCancel = () => {
    if (infoUser) {
      setFormData({
        taiKhoan: infoUser.taiKhoan || '',
        matKhau: '',
        hoTen: infoUser.hoTen || '',
        soDT: infoUser.soDT || '',
        maNhom: infoUser.maNhom || 'GP01',
        email: infoUser.email || ''
      });
    }
    setErrors({});
    setIsEditing(false);
    setShowPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!infoUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-4">
            <span className="text-2xl font-bold text-white">
              {infoUser.hoTen?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Hồ Sơ Cá Nhân</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý và cập nhật thông tin tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Sidebar - Profile Summary */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-center">
                <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 mb-4">
                  <span className="text-2xl font-bold text-white">
                    {infoUser.hoTen?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{infoUser.hoTen}</h2>
                <p className="text-blue-100 text-sm">@{infoUser.taiKhoan}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mt-2">
                  {infoUser.maLoaiNguoiDung === 'GV' ? '👨‍🏫 Giảng viên' : '👨‍🎓 Học viên'}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600">📧</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm truncate">{infoUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600">📱</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">Điện thoại</p>
                      <p className="text-sm">{infoUser.soDT || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-purple-600">👥</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">Nhóm</p>
                      <p className="text-sm">#{infoUser.maNhom}</p>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <span className="mr-2">✏️</span>
                    Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Profile Form */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isEditing ? 'Chỉnh Sửa Thông Tin' : 'Thông Tin Chi Tiết'}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {isEditing ? 'Cập nhật thông tin cá nhân của bạn' : 'Xem và quản lý thông tin cá nhân'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-lg">
                      {isEditing ? '✏️' : '📄'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Username - Readonly */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.taiKhoan}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          🔒
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Tên đăng nhập không thể thay đổi</p>
                    </div>

                    {/* Password với toggle visibility */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="matKhau"
                          value={formData.matKhau}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder={isEditing ? "Nhập mật khẩu mới..." : "••••••••"}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            isEditing 
                              ? 'border-gray-300 bg-white pr-10' 
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          } ${errors.matKhau ? 'border-red-500' : ''}`}
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                          </button>
                        )}
                      </div>
                      {errors.matKhau && (
                        <p className="mt-1 text-xs text-red-600">{errors.matKhau}</p>
                      )}
                      {isEditing && !errors.matKhau && (
                        <p className="mt-1 text-xs text-gray-500">Để trống nếu không muốn thay đổi mật khẩu</p>
                      )}
                    </div>

                    {/* Full Name */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="hoTen"
                        value={formData.hoTen}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          isEditing 
                            ? 'border-gray-300 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        } ${errors.hoTen ? 'border-red-500' : ''}`}
                      />
                      {errors.hoTen && (
                        <p className="mt-1 text-xs text-red-600">{errors.hoTen}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Địa chỉ email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          isEditing 
                            ? 'border-gray-300 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        } ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="soDT"
                        value={formData.soDT}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          isEditing 
                            ? 'border-gray-300 bg-white' 
                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        } ${errors.soDT ? 'border-red-500' : ''}`}
                      />
                      {errors.soDT && (
                        <p className="mt-1 text-xs text-red-600">{errors.soDT}</p>
                      )}
                    </div>

                    {/* Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nhóm học tập
                      </label>
                      <select
                        name="maNhom"
                        value={formData.maNhom}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {Array.from({ length: 15 }, (_, i) => `GP${(i + 1).toString().padStart(2, '0')}`).map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {updateLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <span className="mr-2">💾</span>
                            Lưu thay đổi
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={updateLoading}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        <span className="mr-2">↩️</span>
                        Hủy bỏ
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;