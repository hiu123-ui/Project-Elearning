import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../service/courseService";

const FrontendCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // số item hiển thị trên 1 dòng
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const DEFAULT_IMG =
    "https://rickchilling.com/wp-content/uploads/2024/07/khoa-hoc-lap-trinh-front-end.png";

  useEffect(() => {
    let active = true;
    const fetchFrontendCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCoursesByCategory("FrontEnd", "GP01");
        if (!active) return;
        setCourses(res.data || []);
      } catch (e) {
        if (!active) return;
        console.error("Lỗi tải khóa học FrontEnd:", e);
        setCourses([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchFrontendCourses();
    return () => {
      active = false;
    };
  }, []);

  const openDetail = (id) => {
    navigate(`/detail/${id}`);
    scrollToTop();
  };
  const openAll = () => {
    navigate("/course-page/FrontEnd");
    scrollToTop();
  };

  // Tính toán dữ liệu phân trang
  const totalPages = Math.ceil(courses.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleCourses = courses.slice(startIndex, startIndex + pageSize);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-0">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Khóa học Frontend nổi bật
          </h2>
          <p className="text-gray-500 mt-1">
            Khám phá những khóa học về HTML, CSS, JavaScript, React,...
          </p>
        </div>
        <button
          onClick={openAll}
          className="text-indigo-700 hover:text-white border border-indigo-200 hover:border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Xem tất cả
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-gray-600">Chưa có khóa học FrontEnd nào.</div>
      ) : (
        <>
          {/* Chỉ 1 dòng (4 khóa học / trang) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleCourses.map((course) => (
              <div
                key={course.maKhoaHoc}
                onClick={() => openDetail(course.maKhoaHoc)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition"
                title={course.tenKhoaHoc}
              >
                <div className="relative">
                  <img
                    src={course.hinhAnh || DEFAULT_IMG}
                    alt={course.tenKhoaHoc}
                    className="h-40 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMG;
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-cyan-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    FrontEnd
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[44px] group-hover:text-indigo-700">
                    {course.tenKhoaHoc}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {course.moTa}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      👁️ {course.luotXem?.toLocaleString?.() || course.luotXem || 0}
                    </span>
                    <span>👨‍🎓 {course.soLuongHocVien || 0}</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(course.maKhoaHoc);
                    }}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded-md text-sm ${currentPage === i + 1
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FrontendCourse;
