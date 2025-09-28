import React from 'react';
import { Card, Button } from 'antd';
import {
  TeamOutlined,
  BulbOutlined,
  TrophyOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const InfoPage = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-gray-50 font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white bg-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeInUp">
            Về chúng tôi
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 animate-fadeInUp animation-delay-300">
            Chúng tôi là những người tiên phong trong lĩnh vực E-Learning, mang
            đến tri thức cho mọi người.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu chuyện của chúng tôi
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Bắt đầu từ một ý tưởng nhỏ, chúng tôi nhận thấy tiềm năng to lớn
              của việc học trực tuyến. Với sứ mệnh dân chủ hóa giáo dục, chúng
              tôi đã xây dựng một nền tảng E-Learning vững mạnh, nơi mọi người
              có thể tiếp cận kiến thức chất lượng cao một cách dễ dàng và hiệu
              quả.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi tin rằng học tập là hành trình trọn đời và công nghệ là
              công cụ mạnh mẽ để biến điều đó thành hiện thực.
            </p>
            <Button
              onClick={() => navigate('/courses')}
              type="primary"
              size="large"
              className="mt-6 bg-blue-600 hover:bg-blue-700 transition"
            >
              Xem các khóa học của chúng tôi
            </Button>
          </div>
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-right">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800"
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Giá trị cốt lõi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Chúng tôi cam kết xây dựng một môi trường học tập dựa trên các giá
            trị sau:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-blue-600 text-4xl mb-4">
                <TeamOutlined />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đồng hành</h3>
              <p className="text-gray-500">
                Chúng tôi luôn lắng nghe và hỗ trợ học viên trên mọi chặng đường.
              </p>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-blue-600 text-4xl mb-4">
                <BulbOutlined />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đổi mới</h3>
              <p className="text-gray-500">
                Không ngừng cập nhật công nghệ và phương pháp giảng dạy mới.
              </p>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-blue-600 text-4xl mb-4">
                <TrophyOutlined />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chất lượng</h3>
              <p className="text-gray-500">
                Cam kết chất lượng bài giảng và nội dung học thuật tốt nhất.
              </p>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="text-blue-600 text-4xl mb-4">
                <GlobalOutlined />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kết nối</h3>
              <p className="text-gray-500">
                Tạo ra cộng đồng học tập toàn cầu để chia sẻ và phát triển.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gray-900 text-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình học tập của bạn?
          </h2>
          <p className="text-gray-300 mb-6">
            Tham gia cộng đồng của chúng tôi và mở ra cánh cửa tri thức vô tận.
          </p>
          <Button
            onClick={() => navigate('/register')}
            type="primary"
            size="large"
            className="bg-blue-500 hover:bg-blue-600 border-none transition font-semibold px-8"
          >
            Đăng ký ngay
          </Button>
        </div>
      </section>
    </div>
  );
};

export default InfoPage;