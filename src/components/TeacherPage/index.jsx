import React, { useState } from 'react';
import { Card, Avatar, Rate, Button, Tag, Tooltip, Modal } from 'antd';
import { StarFilled, MessageOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';

const teachers = [
    {
        id: 1,
        name: 'Big DadMoon',
        specialty: 'Lập trình Fullstack',
        rating: 4.9,
        reviews: 128,
        students: 2500,
        courses: 15,
        experience: '8 năm',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        badges: ['Top Rated', 'Mentor'],
        description: 'Chuyên gia lập trình với 8 năm kinh nghiệm giảng dạy'
    },
    {
        id: 2,
        name: 'ICarDi MenBor',
        specialty: 'Vue.js Specialist',
        rating: 4.9,
        reviews: 95,
        students: 1800,
        courses: 12,
        experience: '6 năm',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        badges: ['Vue Expert'],
        description: 'Chuyên gia Vue.js với nhiều dự án thực tế'
    },
    {
        id: 3,
        name: 'Bladin Siaham',
        specialty: 'Hệ thống máy tính',
        rating: 4.8,
        reviews: 87,
        students: 1200,
        courses: 8,
        experience: '10 năm',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
        badges: ['Senior'],
        description: 'Chuyên gia hệ thống và kiến trúc máy tính'
    },
    {
        id: 4,
        name: 'Chris Andersen',
        specialty: 'Full Stack Development',
        rating: 5.0,
        reviews: 156,
        students: 3200,
        courses: 20,
        experience: '12 năm',
        avatar: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=150&h=150&fit=crop&crop=face',
        badges: ['Top Rated', 'Best Seller'],
        description: 'Full-stack developer với 12 năm kinh nghiệm'
    },
    {
        id: 5,
        name: 'VueLo Gadi',
        specialty: 'Phân tích dữ liệu',
        rating: 4.7,
        reviews: 73,
        students: 900,
        courses: 6,
        experience: '5 năm',
        avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop&crop=face',
        badges: ['Data Analyst'],
        description: 'Chuyên gia phân tích và xử lý dữ liệu'
    },
    {
        id: 6,
        name: 'Hoàng Nam',
        specialty: 'PHP & Laravel',
        rating: 4.8,
        reviews: 112,
        students: 2000,
        courses: 10,
        experience: '7 năm',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        badges: ['Backend Expert'],
        description: 'Chuyên gia PHP với nhiều năm kinh nghiệm'
    },
];
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};
const TeacherPage = () => {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showTeacherDetail = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedTeacher(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Đội Ngũ Giảng Viên
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Học tập từ những chuyên gia hàng đầu với nhiều năm kinh nghiệm thực tế
                    </p>

                    {/* Stats Overview */}
                    <div className="flex justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">50+</div>
                            <div className="text-gray-600">Khoá học</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">10K+</div>
                            <div className="text-gray-600">Học viên</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600">4.8</div>
                            <div className="text-gray-600">Đánh giá trung bình</div>
                        </div>
                    </div>
                </div>

                {/* Teachers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-20">
                    {teachers.map((teacher) => (
                        <Card
                            key={teacher.id}
                            className="text-center shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border-0 hover:transform hover:-translate-y-2 cursor-pointer group"
                            bordered={false}
                            onClick={() => showTeacherDetail(teacher)}
                        >
                            {/* Teacher Badge */}
                            <div className="absolute top-3 right-3 z-10">
                                {teacher.badges.map((badge, index) => (
                                    <Tag
                                        key={index}
                                        color={index === 0 ? "gold" : "blue"}
                                        className="text-xs font-semibold"
                                    >
                                        {badge}
                                    </Tag>
                                ))}
                            </div>

                            {/* Avatar with Gradient Border */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full w-24 h-24 mx-auto transform group-hover:scale-110 transition-transform duration-300"></div>
                                <Avatar
                                    size={90}
                                    src={teacher.avatar}
                                    className="relative mx-auto border-4 border-white shadow-lg"
                                />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {teacher.name}
                            </h3>

                            <Tooltip title={teacher.description}>
                                <p className="text-sm text-gray-600 mb-3 leading-tight">
                                    Chuyên gia {teacher.specialty}
                                </p>
                            </Tooltip>

                            {/* Rating Section */}
                            <div className="flex items-center justify-center mb-3">
                                <Rate
                                    disabled
                                    defaultValue={teacher.rating}
                                    allowHalf
                                    character={<StarFilled />}
                                    className="text-yellow-400 text-sm"
                                />
                                <span className="ml-2 text-sm font-semibold text-gray-700">
                                    {teacher.rating}
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="flex justify-between text-xs text-gray-500 mb-4 px-2">
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">{teacher.students}+</div>
                                    <div>Học viên</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">{teacher.courses}</div>
                                    <div>Khoá học</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">{teacher.experience}</div>
                                    <div>Kinh nghiệm</div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                type="primary"
                                ghost
                                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
                                icon={<MessageOutlined />}
                            >
                                Liên hệ
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Testimonial Section */}
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 lg:p-12 text-white overflow-hidden mb-16">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40"></div>
                    </div>

                    <div className="relative flex flex-col lg:flex-row items-center justify-between">
                        <div className="lg:w-2/3 mb-8 lg:mb-0 lg:pr-12">
                            <div className="flex items-center mb-4">
                                <TrophyOutlined className="text-3xl text-yellow-300 mr-3" />
                                <span className="text-yellow-300 font-semibold">Học viên xuất sắc</span>
                            </div>

                            <blockquote className="text-2xl lg:text-3xl font-light leading-relaxed mb-6">
                                "Chương trình giảng dạy được biên soạn cực kỳ chuyên nghiệp, từ cơ bản đến nâng cao.
                                Giảng viên nhiệt tình hỗ trợ 24/7. Mình đã có việc làm ngay sau khi hoàn thành khoá học!"
                            </blockquote>

                            <div>
                                <p className="font-bold text-xl">Nhi Dev</p>
                                <p className="text-blue-100">Fullstack Developer tại TechV Corporation</p>
                                <div className="flex items-center mt-2">
                                    <Rate
                                        disabled
                                        defaultValue={5}
                                        className="text-yellow-300 text-sm"
                                    />
                                    <span className="ml-2 text-blue-100">Đã hoàn thành 5 khoá học</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center transform rotate-12">
                                <div className="w-44 h-44 lg:w-60 lg:h-60 bg-gradient-to-tr from-white to-blue-100 rounded-full flex items-center justify-center transform -rotate-12">
                                    <img
                                        src="https://i.pravatar.cc/300?img=7"
                                        alt="Nhi Dev"
                                        className="w-40 h-40 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                </div>
                            </div>

                            {/* Achievement Badges */}
                            <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                ⭐ Top 1%
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Sẵn sàng bắt đầu hành trình học tập?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Tham gia cộng đồng 10,000+ học viên đã thành công với sự hướng dẫn của các giảng viên hàng đầu
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            type="primary"
                            size="large"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 font-semibold h-12 px-8"
                            icon={<PlayCircleOutlined />}
                            onClick={() => {
                                navigate("/course");
                                scrollToTop();
                            }}
                        >
                            Xem khoá học ngay
                        </Button>
                        <Button
                            size="large"
                            className="font-semibold h-12 px-8"
                        >
                            Tư vấn miễn phí
                        </Button>
                    </div>
                </div>

                {/* Teacher Detail Modal */}
                <Modal
                    title={selectedTeacher ? `Thông tin chi tiết - ${selectedTeacher.name}` : ''}
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={600}
                    className="teacher-modal"
                >
                    {selectedTeacher && (
                        <div className="p-4">
                            <div className="flex items-center mb-6">
                                <Avatar size={100} src={selectedTeacher.avatar} />
                                <div className="ml-6">
                                    <h3 className="text-2xl font-bold">{selectedTeacher.name}</h3>
                                    <p className="text-gray-600">{selectedTeacher.specialty}</p>
                                    <div className="flex items-center mt-2">
                                        <Rate disabled defaultValue={selectedTeacher.rating} />
                                        <span className="ml-2 text-gray-600">
                                            {selectedTeacher.rating} ({selectedTeacher.reviews} đánh giá)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-semibold">Kinh nghiệm</div>
                                    <div>{selectedTeacher.experience}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-semibold">Học viên</div>
                                    <div>{selectedTeacher.students}+</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-semibold">Khoá học</div>
                                    <div>{selectedTeacher.courses}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-semibold">Chứng nhận</div>
                                    <div>{selectedTeacher.badges.join(', ')}</div>
                                </div>
                            </div>

                            <p className="text-gray-700">{selectedTeacher.description}</p>
                        </div>
                    )}
                </Modal>
            </div>

            <style jsx>{`
                .teacher-modal .ant-modal-header {
                    border-bottom: 2px solid #e8f4fd;
                }
                
                .teacher-modal .ant-modal-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #1a365d;
                }
                
                .shadow-custom {
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default TeacherPage;