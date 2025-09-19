import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService } from '../../service/courseService';
const CourseDetailPage = () => {
  const { courseID } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const fetchInfoCourse = async () => {
    try {
      const res = await courseService.getCourseDetail(courseID);
      setCourse(res.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  useEffect(() => {
    fetchInfoCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex items-center gap-3">
          <svg className="animate-spin text-indigo-600" width="22" height="22" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-base font-medium text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  const coverFallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#4F46E5"/>
            <stop offset="100%" stop-color="#7C3AED"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <g fill="#ffffff" opacity="0.2">
          <circle cx="100" cy="80" r="40"/>
          <circle cx="740" cy="120" r="60"/>
          <circle cx="400" cy="360" r="70"/>
        </g>
        <g font-family="Inter,system-ui,-apple-system,Segoe UI,Roboto" text-anchor="middle">
          <text x="50%" y="48%" fill="#ffffff" font-size="44" font-weight="700">Course</text>
          <text x="50%" y="62%" fill="#E9D5FF" font-size="18" font-weight="500">Image Placeholder</text>
        </g>
      </svg>
    `);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200 blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-200 blur-3xl opacity-60" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="flex items-center gap-2 text-sm text-indigo-700">
            <span className="inline-flex items-center gap-1 bg-indigo-100/70 text-indigo-700 px-2.5 py-1 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3l9 6-9 6-9-6 9-6zm-9 8l9 6 9-6v7l-9 6-9-6v-7z" />
              </svg>
              {course.maNhom}
            </span>
            {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc && (
              <span className="inline-flex items-center gap-1 bg-purple-100/70 text-purple-700 px-2.5 py-1 rounded-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3 7h7l-5.5 4 2.5 7-7-4.5-7 4.5L7.5 13 2 9h7l3-7z" />
                </svg>
                {course.danhMucKhoaHoc.tenDanhMucKhoaHoc}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            {course.tenKhoaHoc}
          </h1>

          <p className="mt-4 max-w-3xl text-gray-700 leading-relaxed">
            {course.moTa}
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media + Meta */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
              <div className="relative">
                <img
                  src={course.hinhAnh}
                  alt={course.tenKhoaHoc}
                  className="w-full h-64 sm:h-80 object-cover"
                  onError={e => {
                    e.currentTarget.src = coverFallback;
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex flex-wrap items-center gap-3 text-white/90">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Ngày tạo: {course.ngayTao}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm-1 5h2v6h-2V9zm1 9a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                      </svg>
                      {course.luotXem?.toLocaleString?.() || course.luotXem} lượt xem
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z"/>
                      </svg>
                      {course.soLuongHocVien?.toLocaleString?.() || course.soLuongHocVien} học viên
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9c0-4.4 3.6-8 8-8s8 3.6 8 8v1H3v-1z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Người tạo</div>
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-700 font-semibold">
                          {course.nguoiTao?.hoTen || 'Không rõ'}
                        </span>
                        {course.nguoiTao?.tenLoaiNguoiDung && (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l9 4v6c0 5-4 9-9 9S3 17 3 12V6l9-4z" />
                            </svg>
                            {course.nguoiTao.tenLoaiNguoiDung}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                      </svg>
                      Mã nhóm: <strong className="ml-1">{course.maNhom}</strong>
                    </span>
                  </div>
                </div>

                {/* Info blocks */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/60">
                    <div className="text-sm text-indigo-700">Danh mục</div>
                    <div className="mt-1 font-semibold text-indigo-900">
                      {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || '—'}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/60">
                    <div className="text-sm text-purple-700">Mã khóa học</div>
                    <div className="mt-1 font-semibold text-purple-900">
                      {course.maKhoaHoc || '—'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <div className="text-sm font-semibold text-gray-800">Mô tả khóa học</div>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {course.moTa}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Card */}
          <aside className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-indigo-100 p-6 sticky top-6">
              <div className="text-sm font-semibold text-gray-800">Tổng quan nhanh</div>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center justify-between text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                      <path d="M3 4h18v2H3V4zm2 4h14v2H5V8zm-2 4h18v2H3v-2zm2 4h14v2H5v-2z" />
                    </svg>
                    Tên khóa
                  </span>
                  <span className="font-medium text-gray-900 text-right truncate max-w-[55%]">{course.tenKhoaHoc}</span>
                </li>
                <li className="flex items-center justify-between text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9c0-4.4 3.6-8 8-8s8 3.6 8 8v1H3v-1z"/>
                    </svg>
                    Tác giả
                  </span>
                  <span className="font-medium text-gray-900 text-right truncate max-w-[55%]">
                    {course.nguoiTao?.hoTen || '—'}
                  </span>
                </li>
                <li className="flex items-center justify-between text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                      <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm-1 5h2v6h-2V9zm1 9a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
                    </svg>
                    Lượt xem
                  </span>
                  <span className="font-medium text-gray-900">{course.luotXem?.toLocaleString?.() || course.luotXem}</span>
                </li>
                <li className="flex items-center justify-between text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
                      <path d="M20 6H4v12h16V6zM2 4h20v16H2V4zm10 3l6 4-6 4-6-4 6-4z" />
                    </svg>
                    Ngày tạo
                  </span>
                  <span className="font-medium text-gray-900">{course.ngayTao}</span>
                </li>
              </ul>

              <div className="mt-6">
                <button
                  onClick={()=>{navigate('/register/')}}
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 6l4 4h-3v4h-2v-4H8l4-4zm8 10H4v2h16v-2z" />
                  </svg>
                  Đăng ký khóa học
                </button>
                <p className="mt-3 text-xs text-gray-500 text-center">
                  Nhấn đăng ký để lưu vào danh sách học của bạn.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;