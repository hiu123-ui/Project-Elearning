import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../../../service/courseService';
import { userService } from '../../../service/userService';

const EnrollPage = () => {
    const { courseID } = useParams();

    const [students, setStudents] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // -------------------- Load danh sách học viên --------------------
    const fetchStudentsWithStatus = async () => {
        try {
            const enrolledRes = await courseService.getListStudentOfCource(courseID);
            const pendingRes = await courseService.getPendingStudents(courseID);

            const enrolled = enrolledRes.data.lstHocVien || [];
            const pending = pendingRes.data || [];

            const pendingList = pending.map((item) => ({ ...item, status: 'pending' }));
            const enrolledList = enrolled.map((item) => ({ ...item, status: 'approved' }));

            setStudents([...pendingList, ...enrolledList]);
        } catch (error) {
            console.error('❌ Lỗi tải danh sách:', error);
        }
    };

    useEffect(() => {
        if (courseID) fetchStudentsWithStatus();
    }, [courseID]);

    // -------------------- Gợi ý người dùng --------------------
    const fetchUserSuggestions = async (keyword = '') => {
        try {
            let res;
            if (keyword.trim()) {
                res = await userService.searchUser(keyword);
            } else {
                res = await userService.getListUser();
            }
            setSuggestions(res.data || []);
        } catch (err) {
            console.error('❌ Lỗi lấy danh sách người dùng:', err);
        }
    };

    // -------------------- Xét duyệt / Xóa học viên --------------------
    const handleApprove = async (student) => {
        try {
            await courseService.approveStudent({
                maKhoaHoc: courseID,
                taiKhoan: student.taiKhoan,
            });
            alert(`✅ Đã xét duyệt học viên ${student.hoTen}`);
            await fetchStudentsWithStatus();
        } catch (err) {
            console.error(err);
            alert('❌ Xét duyệt thất bại!');
        }
    };

    const handleDelete = async (student) => {
        if (!window.confirm(`Bạn có chắc muốn xóa học viên ${student.hoTen}?`)) return;
        try {
            await courseService.deleteStudent({
                maKhoaHoc: courseID,
                taiKhoan: student.taiKhoan,
            });
            alert(`🗑️ Đã xóa học viên ${student.hoTen}`);
            await fetchStudentsWithStatus();
        } catch (err) {
            console.error(err);
            alert('❌ Không thể xóa học viên!');
        }
    };

    // -------------------- Ghi danh học viên mới --------------------
    const handleEnrollNewStudent = async () => {
        if (!selectedUser) {
            alert('Vui lòng chọn học viên từ danh sách gợi ý!');
            return;
        }
        try {
            await courseService.enrollStudent({
                maKhoaHoc: courseID,
                taiKhoan: selectedUser.taiKhoan,
            });
            alert(`✅ Đã ghi danh học viên ${selectedUser.hoTen}`);
            setSelectedUser(null);
            setSearchKeyword('');
            setSuggestions([]);
            setShowSuggestions(false);
            await fetchStudentsWithStatus();
        } catch (err) {
            console.error(err);
            alert('❌ Ghi danh thất bại!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">
                <div className="mt-8 mb-10 p-4 border border-gray-300 rounded-lg bg-gray-100 max-w-md mx-auto relative">
                    <h2 className="text-xl font-semibold mb-4">Ghi danh học viên mới</h2>
                    <input
                        type="text"
                        placeholder="Nhập tên hoặc tài khoản học viên"
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                            fetchUserSuggestions(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => {
                            fetchUserSuggestions(''); // load toàn bộ user mặc định
                            setShowSuggestions(true);
                        }}
                        className="w-full p-2 border border-gray-400 rounded-md mb-2"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="border border-gray-300 rounded-md bg-white max-h-60 overflow-auto absolute w-full z-50">
                            {suggestions.map((user) => (
                                <li
                                    key={user.taiKhoan}
                                    className="p-2 hover:bg-blue-100 cursor-pointer"
                                    onClick={() => {
                                        setSearchKeyword(user.taiKhoan);
                                        setSelectedUser(user);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {user.hoTen} - {user.taiKhoan}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        onClick={handleEnrollNewStudent}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Ghi danh học viên
                    </button>
                </div>
                {/* -------------------- Bảng học viên -------------------- */}
                <table className="w-full border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">Họ tên</th>
                            <th className="p-3 text-left">Tài khoản</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((s, i) => (
                                <tr key={s.taiKhoan} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3">{s.hoTen}</td>
                                    <td className="p-3">{s.taiKhoan}</td>
                                    <td className="p-3">
                                        {s.status === 'pending' ? (
                                            <span className="text-yellow-600 font-semibold">⏳ Chờ xét duyệt</span>
                                        ) : (
                                            <span className="text-green-700 font-semibold">✅ Đã ghi danh</span>
                                        )}
                                    </td>
                                    <td className="p-3 flex justify-center gap-2">
                                        {s.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(s)}
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                            >
                                                ✅ Xét duyệt
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(s)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                        >
                                            ❌ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">
                                    Không có học viên nào trong khóa học này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnrollPage;
