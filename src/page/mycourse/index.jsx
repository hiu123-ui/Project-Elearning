import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEnrolledCourses } from '../../stores/course/courseActions';

const MyCoursesPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { infoUser } = useSelector((state) => state.userSlice);
  const enrolledCourses = useSelector((state) => state.courseSlice.enrolledCourses);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchEnrolledCourses());
      setLoading(false);
    };
    fetchData();
  }, [dispatch, infoUser?.taiKhoan]);

  // Danh sách ảnh cố định
  const courseImages = [
    "https://vtiacademy.edu.vn/upload/images/anh-link/review-khoa-hoc-tester.jpg",
    "https://img.freepik.com/free-photo/programming-background-collage_23-2149901783.jpg",
    "https://img.freepik.com/free-photo/html-system-website-concept_23-2150376770.jpg",
    "https://img.freepik.com/free-photo/software-developer-working-computer_23-2151075093.jpg",
    "https://img.freepik.com/free-photo/close-up-image-programer-working-his-desk-office_1098-18707.jpg",
    "https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg",
    "https://img.freepik.com/free-photo/ai-technology-microchip-background-digital-transformation-concept_53876-124669.jpg",
    "https://img.freepik.com/free-photo/developing-programming-coding-technologies_53876-121526.jpg"
  ];

  useEffect(() => {
    fetchEnrolledCoursesData();
  }, []);

  // Hàm fetch dữ liệu từ Redux
  const fetchEnrolledCoursesData = async () => {
    if (!infoUser?.taiKhoan) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Dispatch action để fetch enrolled courses
      await dispatch(fetchEnrolledCourses());
      
      console.log('✅ Đã fetch enrolled courses từ Redux');
    } catch (error) {
      console.error('❌ Lỗi tải khóa học:', error);
      
      // Hiển thị thông báo lỗi
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Không thể tải danh sách khóa học. Vui lòng thử lại!',
          type: 'error'
        }
      });
      window.dispatchEvent(event);
    } finally {
      setLoading(false);
    }
  };

  // Hàm refresh danh sách
  const refreshCourses = () => {
    fetchEnrolledCoursesData();
    
    // Hiển thị thông báo
    const event = new CustomEvent('showToast', {
      detail: {
        message: 'Đang làm mới danh sách khóa học...',
        type: 'info'
      }
    });
    window.dispatchEvent(event);
  };

  // Filter courses theo tab
  const filteredCourses = enrolledCourses.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') {
      const progress = getProgress(course);
      return progress > 0 && progress < 100;
    }
    if (activeTab === 'completed') {
      return getProgress(course) === 100;
    }
    return true;
  });

  // Hàm lấy tiến độ (trong thực tế nên lấy từ API)
  const getProgress = (course) => {
    // Tạm thời dùng random, trong thực tế nên lấy từ API
    return Math.floor(Math.random() * 100);
  };

  const getCourseStatus = (course) => {
    const progress = getProgress(course);
    if (progress === 0) return 'not-started';
    if (progress < 100) return 'in-progress';
    return 'completed';
  };

  if (loading) {
    return <MyCoursesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Khóa học của tôi
                  </h1>
                  <p className="text-gray-600 mt-2 text-lg">
                    Quản lý và theo dõi tiến độ học tập của bạn
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* Nút refresh */}
              <button
                onClick={refreshCourses}
                className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới
              </button>
              
              {/* Nút tìm khóa học mới */}
              <button
                onClick={() => navigate('/courses')}
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tìm khóa học mới
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: 'Tổng số khóa học', 
                value: enrolledCourses.length, 
                color: 'from-gray-500 to-gray-600',
                icon: '📚'
              },
              { 
                label: 'Đã hoàn thành', 
                value: enrolledCourses.filter(c => getCourseStatus(c) === 'completed').length,
                color: 'from-green-500 to-green-600',
                icon: '✅'
              },
              { 
                label: 'Đang học', 
                value: enrolledCourses.filter(c => getCourseStatus(c) === 'in-progress').length,
                color: 'from-blue-500 to-blue-600',
                icon: '📖'
              },
              { 
                label: 'Chưa bắt đầu', 
                value: enrolledCourses.filter(c => getCourseStatus(c) === 'not-started').length,
                color: 'from-orange-500 to-orange-600',
                icon: '⏳'
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm font-medium mt-1">{stat.label}</div>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Enhanced Tabs Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 mb-8 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200/60">
            {[
              { id: 'all', label: 'Tất cả', count: enrolledCourses.length, icon: '🌐' },
              { id: 'in-progress', label: 'Đang học', count: enrolledCourses.filter(c => getCourseStatus(c) === 'in-progress').length, icon: '📊' },
              { id: 'completed', label: 'Đã hoàn thành', count: enrolledCourses.filter(c => getCourseStatus(c) === 'completed').length, icon: '🎓' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[200px] py-5 px-6 text-center font-semibold border-b-2 transition-all duration-300 group ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl">{tab.icon}</span>
                  <div>
                    <div className="text-lg">{tab.label}</div>
                    <div className={`text-sm mt-1 ${
                      activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'
                    }`}>
                      {tab.count} khóa học
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Enhanced Course List */}
          <div className="p-8">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 text-gray-200">
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {activeTab === 'all' ? 'Chưa có khóa học nào' : `Không có khóa học ${activeTab === 'in-progress' ? 'đang học' : 'đã hoàn thành'}`}
                </h3>
                <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto leading-relaxed">
                  {activeTab === 'all' 
                    ? 'Bắt đầu hành trình học tập của bạn bằng cách khám phá các khóa học mới.'
                    : 'Tiếp tục học tập để xem tiến độ của bạn xuất hiện tại đây.'
                  }
                </p>
                <button
                  onClick={() => navigate('/courses')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Khám phá khóa học ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => (
                  <CourseCard 
                    key={course.maKhoaHoc} 
                    course={course} 
                    progress={getProgress(course)}
                    status={getCourseStatus(course)}
                    onContinue={() => navigate(`/learn/${course.maKhoaHoc}`)}
                    imageUrl={course.hinhAnh}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Course Card Component với ảnh cố định
const CourseCard = ({ course, progress, status, onContinue, imageUrl }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed': 
        return { 
          color: 'from-green-500 to-green-600', 
          bg: 'bg-gradient-to-br from-green-50 to-green-100',
          text: 'Đã hoàn thành',
          icon: '✅'
        };
      case 'in-progress': 
        return { 
          color: 'from-blue-500 to-blue-600', 
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          text: 'Đang học',
          icon: '📖'
        };
      default: 
        return { 
          color: 'from-gray-500 to-gray-600', 
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          text: 'Chưa bắt đầu',
          icon: '⏳'
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        {/* Ảnh cố định chất lượng cao */}
        <img
          src={imageUrl}
          alt={course.tenKhoaHoc}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback image nếu ảnh chính không load được
            e.target.src = "https://img.freepik.com/free-photo/programming-background-collage_23-2149901783.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 right-4">
          <span className={`${statusConfig.bg} border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 shadow-lg`}>
            <span>{statusConfig.icon}</span>
            {statusConfig.text}
          </span>
        </div>
        
        {/* Enhanced Progress Bar */}
        {status !== 'not-started' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="text-sm font-medium">Tiến độ học tập</span>
              <span className="text-sm font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {course.tenKhoaHoc}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {course.moTa || "Khóa học chất lượng cao với nội dung đa dạng và phong phú."}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="text-yellow-500 text-lg">⭐</span>
            <span className="font-semibold">{course.danhGia || 4.5}</span>
            <span className="text-gray-400">|</span>
            <span className="text-blue-500 text-lg">👥</span>
            <span className="font-semibold">{course.soLuongHocVien || Math.floor(Math.random() * 1000) + 100}+</span>
          </div>
        </div>

        {/* Nút hành động */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn"
        >
          {status === 'completed' ? (
            <>
              <svg className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Xem lại khóa học
            </>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tiếp tục học tập
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Enhanced Skeleton Loading với ảnh cố định
const MyCoursesSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg mr-4"></div>
                <div>
                  <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-80"></div>
                </div>
              </div>
            </div>
            <div className="h-12 bg-gray-300 rounded-xl w-48"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-2xl p-6 h-32"></div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white/80 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-2xl h-96"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MyCoursesPage;