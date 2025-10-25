import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../../../service/courseService';
import { userService } from '../../../service/userService';
import { notyf } from '../../../ultil/notyf';

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
            const filteredPending = pendingList.filter(
                (p) => !enrolledList.some((e) => e.taiKhoan === p.taiKhoan)
            );
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
            notyf.success(`Đã xét duyệt học viên ${student.hoTen}`);
            await fetchStudentsWithStatus();
        } catch (err) {
            console.error(err);
            notyf.error("Xét duyệt thất bại!");
        }
    };

    const handleDelete = async (student) => {
        if (!window.confirm(`Bạn có chắc muốn xóa học viên ${student.hoTen}?`)) return;
        try {
            await courseService.deleteStudent({
                maKhoaHoc: courseID,
                taiKhoan: student.taiKhoan,
            });
            notyf.success(`Đã xóa học viên ${student.hoTen}`);
            await fetchStudentsWithStatus();
        } catch (err) {
            console.error(err);
            notyf.error("Không thể xóa học viên!");
        }
    };

    // -------------------- Ghi danh học viên mới --------------------
    const handleEnrollNewStudent = async () => {
        if (!selectedUser) {
            notyf.warning("Vui lòng chọn học viên từ danh sách gợi ý!")
            return;
        }
        try {
            await courseService.enrollStudent({
                maKhoaHoc: courseID,
                taiKhoan: selectedUser.taiKhoan,
            });
            await fetchStudentsWithStatus();
            notyf.success(`Đã ghi danh học viên ${selectedUser.hoTen}`);
            setSelectedUser(null);
            setSearchKeyword('');
            setSuggestions([]);
            setShowSuggestions(false);
        } catch (err) {
            console.error(err);
            notyf.error("Ghi danh thất bại!");
        }
    };

    return (
        <div>
            <h3 className="text-3xl mb-6">
                Quản Lý Ghi Danh Khóa Học
            </h3>
            <div className="mt-3 mb-6 w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 font-semibold text-lg">
                    {/* Ô tìm kiếm */}
                    <div className="text-sm">
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
                </div>
                <div className="p-4 text-gray-700">
                    <table className="w-full border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border-b text-left">#</th>
                                <th className="px-4 py-2 border-b text-center">Họ Tên</th>
                                <th className="px-4 py-2 border-b text-left">Tài Khoản</th>
                                <th className="px-4 py-2 border-b text-right">Trạng Thái</th>
                                <th className="px-4 py-2 border-b text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((s, i) => (
                                    <tr
                                        key={`${s.taiKhoan}-${s.status}`}
                                        className="hover:bg-gray-50 odd:bg-white even:bg-gray-100"
                                    >
                                        <td className="px-4 py-2">{i + 1}</td>

                                        {/* Hình ảnh */}
                                        <td className="px-4 py-2 text-center">
                                            {s.hoTen}
                                        </td>

                                        {/* Thông tin khác */}
                                        <td className="px-4 py-2">{s.taiKhoan}</td>
                                        <td className="px-4 py-2 text-right">{s.status === 'pending' ? (
                                            <span className="text-yellow-600 font-semibold">Chờ xét duyệt</span>
                                        ) : (
                                            <span className="text-green-700 font-semibold">Đã ghi danh</span>
                                        )}</td>
                                        <td className="py-2 text-center flex gap-4 justify-center">
                                            {s.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(s)}
                                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                                >
                                                    Xét Duyệt
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(s)}
                                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                            >
                                                Xóa Ghi Danh
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
                {/* Footer - phân trang */}
                <div className="px-4 py-2 border-t border-gray-200 flex justify-center">
                </div>
            </div >
        </div >
    );
};

export default EnrollPage;
