import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { courseService } from '../../service/courseService';
import { setListCourseAction } from '../../stores/course';

const Course = () => {
  const dispatch = useDispatch();
  const { listCourse } = useSelector((state) => state.courseSlice);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getListCourse();
      dispatch(setListCourseAction(response.data));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khóa học:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải danh sách khóa học...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Danh Sách Khóa Học</h1>
      
      {listCourse.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có khóa học nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listCourse.map((course) => (
            <div key={course.maKhoaHoc} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={course.hinhAnh} 
                alt={course.tenKhoaHoc}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://elearningnew.cybersoft.edu.vn/hinhanh/khoa-hoc-python-cho-nguoi-moi-bat-dau_gp01.gif';
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {course.tenKhoaHoc}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.moTa}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">
                    {course.nguoiTao?.hoTen || 'Unknown'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {course.luotXem} lượt xem
                  </span>
                </div>
                <button 
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // Navigate to course detail
                    window.location.href = `/detail/${course.maKhoaHoc}`;
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Course;