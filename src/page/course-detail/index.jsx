import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { courseService } from '../../service/courseService';
import {
  enrollCourseAction,
  checkEnrollmentStatus,
  fetchEnrolledCourses
} from '../../stores/course/courseActions';
import { LocalStorage, keyLocalStorage } from '../../ultil/localStorage';

const CourseDetailPage = () => {
  const { courseID } = useParams();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const enrollmentStatus = useSelector(state => state.courseSlice.enrollmentStatus);
  const { infoUser } = useSelector((state) => state.userSlice);
  const userInfo = LocalStorage.get(keyLocalStorage.INFO_USER);

  // Kiểm tra trạng thái đăng ký
  const isCourseEnrolled = enrollmentStatus[courseID] === 'enrolled';

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch chi tiết khóa học
  const fetchCourseDetail = useCallback(async () => {
    if (!courseID) return;

    setLoading(true);
    try {
      const res = await courseService.getCourseDetail(courseID);
      setCourse(res.data);
      setImageLoaded(false);
      setImageError(false);

      // Fetch khóa học liên quan
      const categoryCode = res.data.danhMucKhoaHoc?.maDanhMucKhoahoc || '';
      if (categoryCode) {
        setLoadingRelated(true);
        try {
          const relatedRes = await courseService.getCoursesByCategory(categoryCode, 'GP01');
          const filteredCourses = relatedRes.data.filter(course => course.maKhoaHoc !== courseID);
          setRelatedCourses(filteredCourses.slice(0, 4));
        } catch (error) {
          console.error('Error fetching related courses:', error);
        } finally {
          setLoadingRelated(false);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  }, [courseID]);

  // Kiểm tra trạng thái đăng ký khi component mount
  useEffect(() => {
    if (courseID && userInfo?.taiKhoan) {
      dispatch(checkEnrollmentStatus(courseID));
    }
  }, [courseID, userInfo?.taiKhoan, dispatch]);

  // Fetch enrolled courses khi user thay đổi
  useEffect(() => {
    if (infoUser?.taiKhoan) {
      dispatch(fetchEnrolledCourses());
    }
  }, [infoUser?.taiKhoan, dispatch]);

  // Fetch chi tiết khóa học khi component mount
  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  const handleEnroll = async () => {
    if (!userInfo) {
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Vui lòng đăng nhập để đăng ký khóa học!',
          type: 'warning'
        }
      });
      window.dispatchEvent(event);
      navigate('/login', { state: { from: `/detail/${courseID}` } });
      return;
    }

    if (isCourseEnrolled) {
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Bạn đã đăng ký khóa học này rồi!',
          type: 'info'
        }
      });
      window.dispatchEvent(event);
      navigate('/my-courses');
      return;
    }

    setIsEnrolling(true);

    try {
      const result = await dispatch(enrollCourseAction(courseID)).unwrap();

      if (result && result.success) {
        console.log('✅ Đăng ký thành công trong component:', result);

        // Hiển thị thông báo thành công
        const event = new CustomEvent('showToast', {
          detail: {
            message: result.message || 'Đăng ký thành công! Đang chuyển hướng...',
            type: 'success'
          }
        });
        window.dispatchEvent(event);

        // QUAN TRỌNG: Gửi sự kiện để MyCourses refresh
        const enrollmentEvent = new CustomEvent('enrollmentSuccess');
        window.dispatchEvent(enrollmentEvent);

        // Đợi một chút để refresh data rồi mới chuyển hướng
        setTimeout(() => {
          navigate('/my-courses');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Lỗi trong quá trình đăng ký:', error);
      // ... xử lý lỗi
    } finally {
      setIsEnrolling(false);
    }
  };

  // Các hàm helper
  const handleCourseClick = (maKhoaHoc) => {
    navigate(`/detail/${maKhoaHoc}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  // 👉 Auto scroll to top khi load trang / đổi khóa học
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseID]);
  // Cuộn lên đầu trang mỗi khi đổi courseID
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseID]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: course?.tenKhoaHoc || 'Khóa học',
      text: course?.moTa || '',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      const event = new CustomEvent('showToast', {
        detail: { message: 'Đã sao chép link vào clipboard!', type: 'success' }
      });
      window.dispatchEvent(event);
    }
  };

  // Loading Skeleton
  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-4 text-red-400">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Không tìm thấy khóa học</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Fixed Progress Bar */}
      <ScrollProgressBar progress={scrollProgress} />

      {/* Header Section */}
      <CourseHeader
        course={course}
        formatDate={formatDate}
        navigate={navigate}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content - Course Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Course Image */}
            <CourseImage
              course={course}
              imageLoaded={imageLoaded}
              imageError={imageError}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
              formatDate={formatDate}
            />

            {/* Instructor Info */}
            <InstructorCard course={course} navigate={navigate} />

            {/* Course Description */}
            <DescriptionCard course={course} />

            {/* Related Courses */}
            <RelatedCoursesSection
              relatedCourses={relatedCourses}
              loadingRelated={loadingRelated}
              onCourseClick={handleCourseClick}
              navigate={navigate}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <CourseQuickInfo course={course} formatDate={formatDate} />
            <CourseActions
              courseID={courseID}
              onShare={handleShare}
              onEnroll={handleEnroll}
              isEnrolling={isEnrolling}
              isEnrolled={isCourseEnrolled}
              userInfo={userInfo}
              navigate={navigate}
            />
            <CourseBenefits />
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <MobileFAB navigate={navigate} />
    </div>
  );
};
const ScrollProgressBar = ({ progress }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[100]">
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Header Component
const CourseHeader = ({ course, formatDate, navigate }) => (
  <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-3xl"></div>
    </div>

    {/* Grid Pattern */}
    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb với design mới */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-3 mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Quay lại trang trước"
        >
          <svg
            className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-white font-medium">Quay lại</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-white/40" aria-hidden="true">▶</span>
          <span className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-lg text-white font-semibold border border-white/10">
            Chi tiết khóa học
          </span>
        </div>
      </nav>

      {/* Course Tags với design glassmorphism */}
      <div className="flex flex-wrap gap-3 mb-8">
        {course?.maNhom && (
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/20 backdrop-blur-sm text-blue-100 border border-blue-400/30">
            📁 {course.maNhom}
          </span>
        )}

        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${course?.danhMucKhoaHoc?.tenDanhMucKhoaHoc
          ? 'bg-purple-500/20 text-purple-100 border-purple-400/30'
          : 'bg-gray-500/20 text-gray-100 border-gray-400/30'
          }`}>
          🏷️ {course?.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Chưa phân loại"}
        </span>
      </div>

      {/* Course Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
        {course?.tenKhoaHoc || "Tên khóa học không có sẵn"}
      </h1>

      {/* Course Description */}
      <div className="mb-10">
        <p className="text-xl text-white/90 leading-relaxed max-w-4xl backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
          {course?.moTa || "Mô tả khóa học hiện không có sẵn."}
        </p>
      </div>

      {/* Quick Stats với card design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 group">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {course?.luotXem?.toLocaleString() || 0}
              </div>
              <div className="text-white/70 text-sm">Lượt xem</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 group">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zm-4 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {course?.soLuongHocVien?.toLocaleString() || 0}
              </div>
              <div className="text-white/70 text-sm">Học viên</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 group">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {course?.ngayTao ? formatDate(course.ngayTao) : "N/A"}
              </div>
              <div className="text-white/70 text-sm">Ngày tạo</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4">

        <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
          💫 Xem preview
        </button>
        <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
          ❤️ Yêu thích
        </button>
      </div>

      {/* Rating và Reviews */}
      <div className="flex items-center space-x-6 mt-6 text-white/80">
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="font-semibold">4.8/5</span>
        </div>
        <div className="w-px h-6 bg-white/30"></div>
        <div className="flex items-center space-x-2">
          <span>⭐ 128 đánh giá</span>
        </div>
        <div className="w-px h-6 bg-white/30"></div>
        <div className="flex items-center space-x-2">
          <span>⏱️ 36 giờ học</span>
        </div>
      </div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
  </div>
);
// Course Image Component
const CourseImage = ({ course, imageLoaded, imageError, onImageLoad, onImageError, formatDate }) => {
  const coverFallback = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#grad)"/>
      <text x="400" y="200" font-family="Arial" font-size="32" fill="white" text-anchor="middle" dy=".3em">${course.tenKhoaHoc}</text>
    </svg>
  `)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="relative">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={imageError ? coverFallback : course.hinhAnh}
          alt={course.tenKhoaHoc}
          className={`w-full h-64 object-cover transition-opacity duration-500 ${imageLoaded || imageError ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={onImageLoad}
          onError={(e) => {
            onImageError();
            e.currentTarget.src = coverFallback;
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="flex flex-wrap gap-4 text-white">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
              <span className="text-sm">Ngày tạo: {formatDate(course.ngayTao)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-sm">{course.luotXem?.toLocaleString() || 0} lượt xem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Instructor Card Component
const InstructorCard = ({ course, navigate }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
      <span>Thông tin giảng viên</span>
    </h3>
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
        {course.nguoiTao?.hoTen?.charAt(0) || 'G'}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-lg">
          {course.nguoiTao?.hoTen || 'Đang cập nhật'}
        </h4>
        <p className="text-gray-600 mt-1">{course.nguoiTao?.tenLoaiNguoiDung || 'Giảng viên'}</p>
        <button
          onClick={() => course.nguoiTao?.taiKhoan && navigate(`/instructor/${course.nguoiTao.taiKhoan}`)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 transition-colors duration-200"
        >
          Xem hồ sơ →
        </button>
      </div>
    </div>
  </div>
);

// Description Card Component
const DescriptionCard = ({ course }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
      </svg>
      <span>Mô tả khóa học</span>
    </h3>
    
    {/* Video minh họa */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Video giới thiệu khóa học</span>
      </h4>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
        <iframe
          src="https://www.youtube.com/embed/7CqJlxBYj-M"
          title="Video giới thiệu khóa học"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Video giới thiệu tổng quan về khóa học
      </p>
    </div>

    {/* Mô tả chi tiết */}
    <div className="prose prose-indigo max-w-none">
      <h4 className="text-md font-semibold text-gray-800 mb-3">📚 Giới thiệu khóa học</h4>
      <div className="text-gray-700 leading-relaxed space-y-4">
        <p>
          <strong>Khóa học {course.tenKhoaHoc || "Lập trình Fullstack"}</strong> được thiết kế 
          toàn diện từ cơ bản đến nâng cao, giúp học viên nắm vững kiến thức và kỹ năng cần thiết 
          để trở thành một lập trình viên chuyên nghiệp.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h5 className="font-semibold text-blue-800 mb-2">🎯 Mục tiêu khóa học</h5>
          <ul className="text-blue-700 space-y-1">
            <li>• Nắm vững kiến thức nền tảng về lập trình</li>
            <li>• Thành thạo các công nghệ Frontend và Backend</li>
            <li>• Có khả năng xây dựng ứng dụng web hoàn chỉnh</li>
            <li>• Rèn luyện tư duy giải quyết vấn đề</li>
            <li>• Chuẩn bị cho công việc thực tế tại doanh nghiệp</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h6 className="font-semibold text-green-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Đối tượng phù hợp
            </h6>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Người mới bắt đầu học lập trình</li>
              <li>• Sinh viên CNTT</li>
              <li>• Developer muốn học thêm stack mới</li>
              <li>• Người muốn chuyển ngành IT</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h6 className="font-semibold text-purple-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Lợi ích đạt được
            </h6>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Kiến thức toàn diện Fullstack</li>
              <li>• Dự án thực tế trong portfolio</li>
              <li>• Hỗ trợ mentor 1:1</li>
              <li>• Certificate có giá trị</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
          <h5 className="font-semibold text-yellow-800 mb-2">⏱️ Thông tin khóa học</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="font-semibold text-yellow-700">Thời lượng</div>
              <div className="text-yellow-600">3-6 tháng</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-700">Bài học</div>
              <div className="text-yellow-600">120+ bài</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-700">Dự án</div>
              <div className="text-yellow-600">5+ dự án</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-700">Hình thức</div>
              <div className="text-yellow-600">Online</div>
            </div>
          </div>
        </div>

        {/* Nội dung mô tả từ API (nếu có) */}
        {course.moTa && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-2">📖 Nội dung chi tiết</h5>
            <p className="text-gray-700 whitespace-pre-line">
              {course.moTa}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);


// Related Courses Section Component
const RelatedCoursesSection = ({ relatedCourses, loadingRelated, onCourseClick, navigate }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
        </svg>
        <span>Khóa học liên quan</span>
      </h3>
      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        {relatedCourses.length} khóa học
      </span>
    </div>

    {loadingRelated ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-20 h-16 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : relatedCourses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedCourses.map((relatedCourse) => (
          <div
            key={relatedCourse.maKhoaHoc}
            onClick={() => onCourseClick(relatedCourse.maKhoaHoc)}
            className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            {/* Ảnh tượng trưng cố định */}
            <div className="w-16 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                {relatedCourse.tenKhoaHoc}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span>{relatedCourse.luotXem?.toLocaleString() || 0} lượt xem</span>
                <span>•</span>
                <span>{relatedCourse.soLuongHocVien?.toLocaleString() || 0} học viên</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z" />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">Chưa có khóa học liên quan</p>
        <button
          onClick={() => navigate('/courses')}
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
        >
          Khám phá khóa học khác →
        </button>
      </div>
    )}
  </div>
);

// Course Quick Info Component
const CourseQuickInfo = ({ course, formatDate }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
      <span>Thông tin nhanh</span>
    </h3>

    <div className="space-y-3">
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Mã khóa học</span>
        <span className="font-medium text-gray-900">{course.maKhoaHoc}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Nhóm</span>
        <span className="font-medium text-gray-900">{course.maNhom}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Danh mục</span>
        <span className="font-medium text-gray-900">{course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || '—'}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Lượt xem</span>
        <span className="font-medium text-gray-900">{course.luotXem?.toLocaleString() || 0}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600">Học viên</span>
        <span className="font-medium text-gray-900">{course.soLuongHocVien?.toLocaleString() || 0}</span>
      </div>
    </div>
  </div>
);

// Course Actions Component - CẬP NHẬT
const CourseActions = ({ courseID, onShare, onEnroll, isEnrolling, isEnrolled, userInfo, navigate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 space-y-4">
      {!isEnrolled ? (
        <button
          onClick={onEnroll}
          disabled={isEnrolling}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl ${isEnrolling ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
            }`}
        >
          {isEnrolling ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </div>
          ) : (
            'Đăng ký ngay'
          )}
        </button>
      ) : (
        <button
          onClick={() => navigate('/my-courses')}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          ✅ Vào học ngay
        </button>
      )}

      <button
        onClick={() => window.open('https://www.youtube.com/@F8VNOfficial/playlists', '_blank')}
        className="w-full border border-indigo-600 text-indigo-600 font-semibold py-3 px-4 rounded-lg hover:bg-indigo-50 transition-all duration-200"
      >
        Xem trước khóa học
      </button>

      <button
        onClick={onShare}
        className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
        </svg>
        <span>Chia sẻ khóa học</span>
      </button>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> {!userInfo
              ? 'Vui lòng đăng nhập để đăng ký khóa học!'
              : isEnrolled
                ? 'Bạn đã đăng ký khóa học này. Hãy bắt đầu học ngay!'
                : 'Đăng ký sớm để nhận ưu đãi và bắt đầu học ngay!'}
          </p>
        </div>
      </div>
    </div>
  );
};
// Course Benefits Component
const CourseBenefits = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
      </svg>
      <span>Lợi ích khóa học</span>
    </h3>

    <div className="space-y-3">
      {[
        'Kiến thức thực tế và ứng dụng cao',
        'Hỗ trợ 24/7 từ giảng viên',
        'Certificate sau khi hoàn thành',
        'Truy cập trọn đời',
        'Cập nhật nội dung mới nhất'
      ].map((benefit, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <span className="text-gray-700 text-sm">{benefit}</span>
        </div>
      ))}
    </div>
  </div>
);

// Mobile FAB Component
const MobileFAB = ({ navigate }) => (
  <div className="lg:hidden fixed bottom-6 right-6 z-40">
    <button
      onClick={() => navigate('/register/')}
      className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  </div>
);

// Skeleton Component
const CourseDetailSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Image Skeleton */}
          <div className="bg-gray-300 rounded-2xl h-64"></div>

          {/* Content Skeletons */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Sidebar Skeletons */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CourseDetailPage;
