import React from "react";

const UserTable = ({ users, onEdit, onDelete, onAssign }) => {
    return (
        <div className="p-4 text-gray-700">
            <table className="w-full border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Tài khoản</th>
                        <th className="px-4 py-2 border-b text-left">Họ tên</th>
                        <th className="px-4 py-2 border-b text-left">Email</th>
                        <th className="px-4 py-2 border-b text-left">Số điện thoại</th>
                        <th className="px-4 py-2 border-b text-left">Loại người dùng</th>
                        <th className="px-4 py-2 border-b text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr
                                key={user.taiKhoan}
                                className="hover:bg-gray-50 odd:bg-white even:bg-gray-100"
                            >
                                <td className="px-4 py-2">{user.taiKhoan}</td>
                                {/* Thông tin người dùng */}
                                <td className="px-4 py-2">{user.hoTen}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.soDT || user.soDt}</td>
                                <td className="px-4 py-2">{user.maLoaiNguoiDung}</td>

                                {/* Nút thao tác */}
                                <td className="px-4 py-2 w-[220px] text-center space-x-2">
                                    {onAssign && (
                                        <button
                                            onClick={() => onAssign(user)}
                                            className="px-2 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            Ghi danh
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEdit?.(user)}
                                        className="px-2 py-1 text-sm rounded bg-yellow-400 text-white hover:bg-yellow-500"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(user.taiKhoan)}
                                        className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="8"
                                className="text-center py-4 text-gray-500 italic"
                            >
                                Không tìm thấy người dùng nào phù hợp.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
