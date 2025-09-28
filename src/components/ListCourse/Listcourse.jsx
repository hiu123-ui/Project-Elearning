import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListCourseAction } from "../../stores/course";
import { courseService } from "../../service/courseService";
import { Card } from "antd";
import {
  EyeOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const Listcourse = () => {
  const dispatch = useDispatch();
  const listCourse = useSelector((state) => state.courseSlice.listCourse);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const fetchListCourse = async () => {
    try {
      const resListcourse = await courseService.getListCourse();
      dispatch(setListCourseAction(resListcourse.data));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchListCourse();
  }, []);

  const handleCourseDetailPage = (courseID) => {
    navigate(`/detail/${courseID}`);
  };

  const paginatedCourses = listCourse?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil((listCourse?.length || 0) / pageSize);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white  sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            🚀 Danh Sách Khóa Học Nổi Bật
          </h2>
          <p className="text-lg text-gray-500">
            Cập nhật những khóa học hot nhất giúp bạn chinh phục lập trình.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {paginatedCourses?.map((course) => (
            <Card
              onClick={() => handleCourseDetailPage(course.maKhoaHoc)}
              key={course.maKhoaHoc}
              hoverable
              cover={
                <div className="relative overflow-hidden">
                  <img
                    alt={course.tenKhoaHoc}
                    src="https://ectimes.wordpress.com/wp-content/uploads/2019/03/cac-ngon-ngu-lap-trinh-pho-bien-2.jpg"
                    className="h-48 w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110 rounded-t-xl"
                    onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Course")
                    }
                  />
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Hot
                  </span>
                </div>
              }
              className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="p-5">
                <Meta
                  title={
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 leading-tight line-clamp-2">
                      {course.tenKhoaHoc}
                    </h3>
                  }
                  description={
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[42px]">
                      {course.moTa}
                    </p>
                  }
                />

                {/* Info */}
                <div className="flex justify-between items-center text-xs text-gray-500 mb-5 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <EyeOutlined />
                    <span>{course.luotXem?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TeamOutlined />
                    <span>{course.soLuongHocVien}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarOutlined />
                    <span>{course.ngayTao}</span>
                  </div>
                </div>

                {/* Button */}
                <button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition"
                >
                  Xem Chi Tiết
                  <ArrowRightOutlined className="text-xs" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 space-x-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            {/* Page Numbers (rút gọn) */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              // chỉ hiện trang đầu, cuối, current, và 1 trang lân cận
              if (
                page === 1 ||
                page === totalPages ||
                Math.abs(currentPage - page) <= 1
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm transition ${currentPage === page
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                );
              }
              // dấu "..."
              if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listcourse;
