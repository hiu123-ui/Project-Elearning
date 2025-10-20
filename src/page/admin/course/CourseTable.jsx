import React from "react";

const CourseTable = ({ courses, onEdit, onDelete, onAssign }) => {
    return (
        <div className="p-4 text-gray-700">
            <table className="w-full border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Mã KH</th>
                        <th className="px-4 py-2 border-b text-center">Hình ảnh</th>
                        <th className="px-4 py-2 border-b text-left">Tên khóa học</th>
                        <th className="px-4 py-2 border-b text-right">Lượt xem</th>
                        <th className="px-4 py-2 border-b text-left">Ngày tạo</th>
                        <th className="px-4 py-2 border-b text-right">Học viên</th>
                        <th className="px-4 py-2 border-b text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <tr
                                key={course.maKhoaHoc}
                                className="hover:bg-gray-50 odd:bg-white even:bg-gray-100"
                            >
                                <td className="px-4 py-2">{course.maKhoaHoc}</td>

                                {/* Hình ảnh */}
                                <td className="px-4 py-2 text-center">
                                    <img
                                        src={course.hinhAnh}
                                        alt={course.tenKhoaHoc}
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => {
                                            const img = e.target;
                                            img.onerror = null; // tránh lặp sự kiện
                                            const originalSrc = img.src;
                                            const maNhom = (course.maNhom || "gp01").toLowerCase();
                                            try {
                                                if (originalSrc.includes(`_${maNhom}`)) {
                                                    img.src = "/images/default.jpg";
                                                    return;
                                                }
                                                const dotIndex = originalSrc.lastIndexOf(".");
                                                const fallbackSrc =
                                                    dotIndex !== -1
                                                        ? `${originalSrc.substring(0, dotIndex)}_${maNhom}${originalSrc.substring(dotIndex)}`
                                                        : `${originalSrc}_${maNhom}`;

                                                img.src = fallbackSrc;

                                                // Nếu fallback lỗi → đổi sang default, và không gọi thêm nữa
                                                img.onerror = () => {
                                                    img.onerror = null;
                                                    img.src = "/images/default.jpg";
                                                };
                                            } catch {
                                                img.src = "/images/default.jpg";
                                            }
                                        }}
                                    />
                                </td>

                                {/* Thông tin khác */}
                                <td className="px-4 py-2">{course.tenKhoaHoc}</td>
                                <td className="px-4 py-2 text-right">{course.luotXem}</td>
                                <td className="px-4 py-2">{course.ngayTao}</td>
                                <td className="px-4 py-2 text-right">
                                    {course.soLuongHocVien}
                                </td>

                                {/* Nút thao tác */}
                                <td className="px-4 py-2 w-[200px] text-center space-x-2">
                                    <button
                                        onClick={() => onAssign?.(course)}
                                        className="px-2 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Ghi danh
                                    </button>
                                    <button
                                        onClick={() => onEdit?.(course)}
                                        className="px-2 py-1 text-sm rounded bg-yellow-400 text-white hover:bg-yellow-500"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(course.maKhoaHoc)}
                                        className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4 text-gray-500 italic">
                                Không tìm thấy khóa học nào phù hợp.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default CourseTable;
