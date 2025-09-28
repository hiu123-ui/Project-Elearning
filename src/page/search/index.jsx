import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { courseService } from '../../service/courseService';
import { useSelector } from 'react-redux';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { infoUser } = useSelector((state) => state.userSlice);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const query = urlParams.get('q');
        
        if (query) {
            setSearchQuery(query);
            performSearch(query);
        }
    }, [location.search]);

    const performSearch = async (query) => {
        if (!query.trim()) return;
        
        setLoading(true);
        try {
            const res = await courseService.searchCourses(query);
            setSearchResults(res.data || []);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        }
        setLoading(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleCourseClick = (course) => {
        navigate(`/detail/${course.maKhoaHoc}`);
    };

    const handleEnrollClick = (course) => {
        if (!infoUser) {
            navigate('/login');
            return;
        }
        // Logic đăng ký khóa học
        console.log('Enroll course:', course);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Search Header */}
                <div className="mb-8">
                    <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm khóa học..."
                                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                                🔍
                            </div>
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </form>
                </div>

                {/* Search Results */}
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Đang tìm kiếm...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Kết quả tìm kiếm cho "{searchQuery}"
                                </h1>
                                <p className="text-gray-600">
                                    Tìm thấy {searchResults.length} khóa học
                                </p>
                            </div>

                            {searchResults.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        Không tìm thấy kết quả
                                    </h3>
                                    <p className="text-gray-500">
                                        Thử với từ khóa khác hoặc duyệt danh mục khóa học
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {searchResults.map((course) => (
                                        <div key={course.maKhoaHoc} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex gap-6">
                                                    <div className="flex-shrink-0">
                                                        <img 
                                                            src={course.hinhAnh} 
                                                            alt={course.tenKhoaHoc}
                                                            className="w-32 h-24 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/128x96?text=Course';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 
                                                            className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer mb-2"
                                                            onClick={() => handleCourseClick(course)}
                                                        >
                                                            {course.tenKhoaHoc}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                            {course.moTa}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                👤 {course.nguoiTao?.hoTen || 'Admin'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                ⭐ {course.danhGia || 4.5}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                👁️ {course.luotXem || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0 flex flex-col gap-2">
                                                        <button
                                                            onClick={() => handleCourseClick(course)}
                                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                        <button
                                                            onClick={() => handleEnrollClick(course)}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                        >
                                                            Đăng ký
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;