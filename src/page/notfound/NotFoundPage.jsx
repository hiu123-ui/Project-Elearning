// src/page/not-found/NotFoundPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  // Tự động scroll lên đầu trang khi component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Cuộn mượt mà
    });
  }, []); // Chạy một lần khi component mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animation/Illustration */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-6xl mb-4 shadow-2xl">
            404
          </div>
        </div>
        
        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Trang không tìm thấy
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            onClick={() => window.scrollTo(0, 0)} // Thêm scroll khi click về trang chủ
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Link>
          
          <button
            onClick={() => {
              window.history.back();
              window.scrollTo(0, 0); // Thêm scroll khi quay lại
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cần hỗ trợ?</h3>
          <p className="text-gray-600 mb-4">
            Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với chúng tôi.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => window.scrollTo(0, 0)}
            >
              Liên hệ hỗ trợ
            </Link>
            <Link
              to="/help"
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => window.scrollTo(0, 0)}
            >
              Trung tâm trợ giúp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;