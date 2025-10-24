import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo,clearUpdateSuccess, refreshUserInfo } from '../../../stores/user';

const ProfileAdminPage = () => {
    const dispatch = useDispatch();
    const { infoUser, updateLoading, updateSuccess, error } = useSelector((s) => s.userSlice);

    const [formData, setFormData] = useState({
        taiKhoan: '',
        hoTen: '',
        email: '',
        soDT: '',
        maNhom: '',
        matKhau: '',
        maLoaiNguoiDung: 'HV'
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
                matKhau: '',
                maLoaiNguoiDung: infoUser.maLoaiNguoiDung || 'HV'
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [infoUser]);

    // Khi cập nhật thành công
    useEffect(() => {
        if (updateSuccess) {
            setLocalSuccess('🎉 Cập nhật thông tin thành công!');
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

    // Validate
    const validateForm = () => {
        const newErrors = {};

        if (!formData.hoTen.trim()) newErrors.hoTen = 'Họ tên không được để trống';
        else if (formData.hoTen.trim().length < 2) newErrors.hoTen = 'Họ tên quá ngắn';

        if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';

        if (!formData.soDT.trim()) newErrors.soDT = 'Số điện thoại không được để trống';
        else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.soDT.replace(/\s/g, '')))
            newErrors.soDT = 'Số điện thoại không hợp lệ';

        if (formData.matKhau && formData.matKhau.length < 6)
            newErrors.matKhau = 'Mật khẩu ít nhất 6 ký tự';

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
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
            maLoaiNguoiDung: formData.maLoaiNguoiDung
        };

        if (formData.matKhau) payload.matKhau = formData.matKhau;
        dispatch(updateUserInfo(payload));
    };

    const onCancel = () => {
        setFormData(originalData);
        setErrors({});
        setIsEditing(false);
    };

    const onRefresh = () => {
        dispatch(refreshUserInfo());
        setLocalSuccess('🔄 Đang làm mới dữ liệu...');
        setTimeout(() => setLocalSuccess(''), 2000);
    };

    // Format hiển thị số điện thoại
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                        Hồ Sơ Cá Nhân
                    </h1>
                    <p className="text-gray-600 text-lg">Quản lý thông tin cá nhân và loại người dùng của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Thông tin bên trái */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-4">
                                    {infoUser.hoTen?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900">{infoUser.hoTen}</h2>
                                <p className="text-gray-500">@{infoUser.taiKhoan}</p>
                                <div className="inline-flex items-center px-4 py-2 mt-3 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {formData.maLoaiNguoiDung === 'GV' ? '👨‍🏫 Giảng viên' : '👨‍🎓 Học viên'}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <InfoRow label="Họ tên" value={infoUser.hoTen} icon="👤" />
                                <InfoRow label="Email" value={infoUser.email} icon="📧" />
                                <InfoRow label="Điện thoại" value={displayPhone} icon="📱" />
                                <InfoRow label="Mã nhóm" value={infoUser.maNhom} icon="🎓" />
                            </div>
                        </div>
                    </div>

                    {/* Form chỉnh sửa */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {isEditing ? 'Chỉnh sửa thông tin' : 'Thông tin chi tiết'}
                                    </h2>
                                    <p className="text-gray-600">
                                        {isEditing ? 'Cập nhật thông tin cá nhân và loại người dùng' : 'Xem thông tin cá nhân hiện tại'}
                                    </p>
                                </div>

                                <div className="flex gap-3 mt-4 sm:mt-0">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow"
                                            >
                                                ✏️ Chỉnh sửa
                                            </button>
                                            <button
                                                onClick={onRefresh}
                                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold flex items-center gap-2"
                                            >
                                                🔄 Làm mới
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={onCancel}
                                            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold flex items-center gap-2"
                                        >
                                            ❌ Hủy bỏ
                                        </button>
                                    )}
                                </div>
                            </div>

                            {(localSuccess || error) && (
                                <div
                                    className={`mb-6 p-4 rounded-xl ${localSuccess
                                            ? 'bg-green-50 border border-green-200 text-green-800'
                                            : 'bg-red-50 border border-red-200 text-red-800'
                                        }`}
                                >
                                    {localSuccess || error}
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="space-y-6">
                                {/* Tên đăng nhập & mật khẩu */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Tên đăng nhập"
                                        value={formData.taiKhoan}
                                        disabled
                                    />
                                    <InputField
                                        label="Mật khẩu mới"
                                        name="matKhau"
                                        type="password"
                                        placeholder="Để trống nếu không đổi mật khẩu"
                                        value={formData.matKhau}
                                        onChange={onChange}
                                        disabled={!isEditing}
                                        error={errors.matKhau}
                                    />
                                </div>

                                {/* Họ tên */}
                                <InputField
                                    label="Họ tên *"
                                    name="hoTen"
                                    value={formData.hoTen}
                                    onChange={onChange}
                                    disabled={!isEditing}
                                    placeholder="Nhập họ tên đầy đủ"
                                    error={errors.hoTen}
                                />

                                {/* Email */}
                                <InputField
                                    label="Email *"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={onChange}
                                    disabled={!isEditing}
                                    placeholder="example@gmail.com"
                                    error={errors.email}
                                />

                                {/* Điện thoại và mã nhóm */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Số điện thoại *"
                                        name="soDT"
                                        value={formData.soDT}
                                        onChange={onChange}
                                        disabled={!isEditing}
                                        placeholder="0912 345 678"
                                        error={errors.soDT}
                                    />
                                    <InputField
                                        label="Mã nhóm"
                                        name="maNhom"
                                        value={formData.maNhom}
                                        onChange={onChange}
                                        disabled
                                        placeholder="GP01"
                                    />
                                </div>

                                {/* Loại người dùng */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại người dùng *
                                    </label>
                                    <select
                                        name="maLoaiNguoiDung"
                                        value={formData.maLoaiNguoiDung}
                                        onChange={onChange}
                                        disabled={!isEditing}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${!isEditing
                                                ? 'bg-gray-50 cursor-not-allowed border-gray-300 text-gray-500'
                                                : 'bg-white border-gray-300'
                                            }`}
                                    >
                                        <option value="HV">👨‍🎓 Học viên</option>
                                        <option value="GV">👨‍🏫 Giảng viên</option>
                                    </select>
                                </div>

                                {isEditing && (
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {updateLoading ? (
                                            <>
                                                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                💾 Lưu thay đổi
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

// Component con để giảm trùng code
const InfoRow = ({ label, value, icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">{icon}</div>
            <span className="text-gray-700 font-medium">{label}</span>
        </div>
        <span className="text-gray-900 font-semibold">{value || 'Chưa cập nhật'}</span>
    </div>
);

const InputField = ({ label, name, type = 'text', value, onChange, disabled, placeholder, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${disabled
                    ? 'bg-gray-50 cursor-not-allowed border-gray-300 text-gray-500'
                    : error
                        ? 'border-red-300 bg-red-50'
                        : 'bg-white border-gray-300'
                }`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

export default ProfileAdminPage;
