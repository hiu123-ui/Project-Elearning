import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { courseService } from '../../service/courseService'
import { setCoursesByCategoryAction } from '../../stores/course'


const normalize = (v) => (v || '').toString().trim().toLowerCase();
const SKELETON_COUNT = 8;
const DEFAULT_IMG = 'https://via.placeholder.com/600x400?text=Course';
const BACKEND_IMG = 'https://canhme.com/wp-content/uploads/2018/09/Nodejs.png';


const SkeletonCard = () => (
  <div className="bg-white border border-blue-50 rounded-xl shadow-sm overflow-hidden animate-pulse" aria-hidden>
    <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
    <div className="p-3 space-y-3">
      <div className="h-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded"></div>
        <div className="h-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded w-5/6"></div>
      </div>
      <div className="h-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded"></div>
    </div>
  </div>
);

const CourseCard = ({ course, cover, onOpen }) => {
  const teacherName = course.nguoiTao?.hoTen || 'Giảng viên';
  const avatarText = teacherName?.[0] || 'G';

  return (
    <article
      className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      title={course.tenKhoaHoc}
      aria-label={`Mở chi tiết khóa học ${course.tenKhoaHoc}`}
    >
      <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <img
          src={cover}
          alt={course.tenKhoaHoc}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
        />
        <span className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          Mã: {course.maKhoaHoc}
        </span>
      </div>
      
      <div className="p-3 flex-1">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight">
          {course.tenKhoaHoc}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
          {course.moTa}
        </p>
      </div>
      
      <div className="p-3 border-t border-dashed border-blue-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
            {avatarText}
          </div>
          <span className="text-gray-900 font-medium text-sm truncate max-w-[100px]">
            {teacherName}
          </span>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Xem chi tiết
        </button>
      </div>
    </article>
  );
};

function CoursePages() {
  const { maDanhMuc } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector((state) => state.courseSlice.coursesByCategory);
  const [isLoading, setIsLoading] = useState(true);

  const normalizedCat = useMemo(() => normalize(maDanhMuc), [maDanhMuc]);
  const isBackEndCategory = normalizedCat === 'backend';

  useEffect(() => {
    const controller = new AbortController();
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await courseService.getCoursesByCategory(maDanhMuc, 'GP01', {
          signal: controller.signal
        });
        dispatch(setCoursesByCategoryAction(res.data));
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          console.error('Lỗi lấy danh sách khóa học:', error);
          dispatch(setCoursesByCategoryAction([]));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
    return () => controller.abort();
  }, [maDanhMuc, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero header */}
      <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Khóa học: <span className="text-blue-600">{maDanhMuc}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các khóa học nổi bật thuộc danh mục này
            </p>
          </div>
        </div>
      </section>

      {/* Grid section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (courses?.length ?? 0) === 0 ? (
          <div className="text-center py-16" role="status">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có khóa học nào trong danh mục này
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Hãy thử chọn danh mục khác để tiếp tục khám phá.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => {
              const cover = isBackEndCategory ? BACKEND_IMG : (course.hinhAnh || DEFAULT_IMG);
              return (
                <CourseCard
                  key={course.maKhoaHoc}
                  course={course}
                  cover={cover}
                  onOpen={() => navigate(`/detail/${course.maKhoaHoc}`)} // đúng route
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default CoursePages;