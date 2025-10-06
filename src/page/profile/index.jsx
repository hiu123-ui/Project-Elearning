import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo, refreshUserInfo, clearUpdateSuccess } from '../../stores/user';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { infoUser, updateLoading, updateSuccess, error } = useSelector((s) => s.userSlice);

  const [formData, setFormData] = useState({
    taiKhoan: '',
    hoTen: '',
    email: '',
    soDT: '',
    maNhom: '',
    matKhau: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [localSuccess, setLocalSuccess] = useState('');

  // Khởi tạo dữ liệu khi có infoUser
  useEffect(() => {
    if (infoUser) {
      const userData = {
        taiKhoan: infoUser.taiKhoan || '',
        hoTen: infoUser.hoTen || '',
        email: infoUser.email || '',
        soDT: infoUser.soDT || infoUser.soDi || '',
        maNhom: infoUser.maNhom || 'GP01',
        matKhau: ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [infoUser]);

  // Xử lý khi cập nhật thành công
  useEffect(() => {
    if (updateSuccess) {
      setLocalSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setFormData(prev => ({ ...prev, matKhau: '' }));
      
      setTimeout(() => {
        dispatch(refreshUserInfo());
      }, 500);
      
      const timeout = setTimeout(() => {
        dispatch(clearUpdateSuccess());
        setLocalSuccess('');
      }, 4000);
      
      return () => clearTimeout(timeout);
    }
  }, [updateSuccess, dispatch]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hoTen.trim()) {
      newErrors.hoTen = 'Họ tên không được để trống';
    } else if (formData.hoTen.trim().length < 2) {
      newErrors.hoTen = 'Họ tên quá ngắn';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.soDT.trim()) {
      newErrors.soDT = 'Số điện thoại không được để trống';
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.soDT.replace(/\s/g, ''))) {
      newErrors.soDT = 'Số điện thoại không hợp lệ';
    }
    
    if (formData.matKhau && formData.matKhau.length < 6) {
      newErrors.matKhau = 'Mật khẩu ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'soDT') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 4) processedValue = cleaned;
      else if (cleaned.length <= 7) processedValue = `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
      else processedValue = `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const hasChanges = Object.keys(formData).some(key => {
      if (key === 'matKhau') return formData[key] !== '';
      return formData[key] !== originalData[key];
    });

    if (!hasChanges) {
      setLocalSuccess('Không có thay đổi nào để cập nhật!');
      setIsEditing(false);
      setTimeout(() => setLocalSuccess(''), 3000);
      return;
    }

    const payload = {
      taiKhoan: formData.taiKhoan,
      hoTen: formData.hoTen.trim(),
      email: formData.email.trim(),
      soDT: formData.soDT.replace(/\s/g, ''),
      maNhom: formData.maNhom,
      maLoaiNguoiDung: infoUser.maLoaiNguoiDung || 'HV'
    };

    if (formData.matKhau) {
      payload.matKhau = formData.matKhau;
    }

    dispatch(updateUserInfo(payload));
  };

  const onCancel = () => {
    setFormData(originalData);
    setErrors({});
    setIsEditing(false);
  };

  const onRefresh = () => {
    dispatch(refreshUserInfo());
    setLocalSuccess('Đang làm mới dữ liệu...');
    setTimeout(() => setLocalSuccess(''), 2000);
  };

  // Format số điện thoại để hiển thị
  const displayPhone = useMemo(() => {
    const phoneValue = infoUser?.soDT || infoUser?.soDi || formData.soDT || '';
    if (!phoneValue) return 'Chưa cập nhật';
    
    const cleaned = phoneValue.replace(/\s/g, '');
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
  }, [infoUser?.soDT, infoUser?.soDi, formData.soDT]);

  if (!infoUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hồ Sơ Cá Nhân</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quản lý và cập nhật thông tin cá nhân của bạn một cách dễ dàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white mb-4">
                  {infoUser.hoTen?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{infoUser.hoTen}</h2>
                <p className="text-gray-500 mb-3">@{infoUser.taiKhoan}</p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {infoUser.maLoaiNguoiDung === 'GV' ? '👨‍🏫 Giảng viên' : '👨‍🎓 Học viên'}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">👤</span>
                    </div>
                    <span className="text-gray-700 font-medium">Họ tên</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{infoUser.hoTen}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">📧</span>
                    </div>
                    <span className="text-gray-700 font-medium">Email</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{infoUser.email}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600">📱</span>
                    </div>
                    <span className="text-gray-700 font-medium">Điện thoại</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-900 font-semibold block">{displayPhone}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      displayPhone !== 'Chưa cập nhật' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {displayPhone !== 'Chưa cập nhật' ? 'Đã cập nhật' : 'Chưa cập nhật'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600">🎓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Mã nhóm</span>
                  </div>
                  <span className="text-gray-900 font-semibold">{infoUser.maNhom}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditing ? 'Chỉnh Sửa Thông Tin' : 'Thông Tin Chi Tiết'}
                  </h2>
                  <p className="text-gray-600">
                    {isEditing ? 'Cập nhật thông tin cá nhân của bạn bên dưới' : 'Xem và quản lý thông tin cá nhân của bạn'}
                  </p>
                </div>
                
                <div className="flex gap-3 mt-4 sm:mt-0">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={onRefresh}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Làm mới
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onCancel}
                      className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hủy bỏ
                    </button>
                  )}
                </div>
              </div>

              {/* Thông báo */}
              {(localSuccess || error) && (
                <div className={`mb-6 p-4 rounded-xl ${
                  localSuccess 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center gap-3">
                    {localSuccess ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <p className="font-medium">
                      {localSuccess || error}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.taiKhoan}
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="matKhau"
                      value={formData.matKhau}
                      onChange={onChange}
                      disabled={!isEditing}
                      placeholder="Để trống nếu không đổi mật khẩu"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        !isEditing 
                          ? 'bg-gray-50 cursor-not-allowed border-gray-300' 
                          : errors.matKhau
                            ? 'border-red-300 bg-red-50'
                            : 'bg-white border-gray-300'
                      }`}
                    />
                    {errors.matKhau && (
                      <p className="mt-1 text-sm text-red-600">{errors.matKhau}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={onChange}
                    disabled={!isEditing}
                    placeholder="Nhập họ và tên đầy đủ"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      !isEditing 
                        ? 'bg-gray-50 cursor-not-allowed border-gray-300' 
                        : errors.hoTen
                          ? 'border-red-300 bg-red-50'
                          : 'bg-white border-gray-300'
                    }`}
                  />
                  {errors.hoTen && (
                    <p className="mt-1 text-sm text-red-600">{errors.hoTen}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    disabled={!isEditing}
                    placeholder="example@gmail.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      !isEditing 
                        ? 'bg-gray-50 cursor-not-allowed border-gray-300' 
                        : errors.email
                          ? 'border-red-300 bg-red-50'
                          : 'bg-white border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="text"
                      name="soDT"
                      value={formData.soDT}
                      onChange={onChange}
                      disabled={!isEditing}
                      placeholder="0912 345 678"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        !isEditing 
                          ? 'bg-gray-50 cursor-not-allowed border-gray-300' 
                          : errors.soDT
                            ? 'border-red-300 bg-red-50'
                            : 'bg-white border-gray-300'
                      }`}
                    />
                    {errors.soDT && (
                      <p className="mt-1 text-sm text-red-600">{errors.soDT}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã nhóm
                    </label>
                    <input
                      type="text"
                      name="maNhom"
                      value={formData.maNhom}
                      onChange={onChange}
                      disabled={!isEditing}
                      placeholder="GP01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl cursor-not-allowed text-gray-500"
                    />
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {updateLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;