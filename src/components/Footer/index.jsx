import React from "react";
import { Row, Col } from "antd";
import {
  FacebookFilled,
  YoutubeFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  InstagramFilled,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CrownFilled,
  SafetyCertificateFilled,
  CustomerServiceFilled,
  RocketFilled
} from "@ant-design/icons";

const FooterPages = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 relative overflow-hidden">
      {/* Background Pattern với hiệu ứng tinh tế */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur-3xl"></div>
      </div>

      {/* Hiệu ứng ánh sáng viền */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="px-6 md:px-16 lg:px-24 py-16">
          <Row gutter={[48, 32]}>
            {/* Brand Section */}
            <Col xs={24} lg={6}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/20">
                  <CrownFilled className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  E-Learning
                </h2>
              </div>
              <p className="text-sm leading-relaxed mb-8 text-gray-400">
                Nền tảng học trực tuyến hàng đầu Việt Nam, mang đến trải nghiệm 
                học tập đột phá với công nghệ tiên tiến và đội ngũ giảng viên chất lượng.
              </p>
              
              {/* Trust Badges */}
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <SafetyCertificateFilled className="text-green-400 text-sm" />
                  </div>
                  <span className="text-xs font-medium">Chứng nhận chất lượng giáo dục</span>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <CustomerServiceFilled className="text-blue-400 text-sm" />
                  </div>
                  <span className="text-xs font-medium">Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <RocketFilled className="text-orange-400 text-sm" />
                  </div>
                  <span className="text-xs font-medium">10,000+ học viên thành công</span>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col xs={24} sm={12} lg={4}>
              <h3 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-gray-700/50 relative">
                Liên kết nhanh
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              </h3>
              <div className="space-y-3">
                {[
                  "Khóa học mới nhất",
                  "Chương trình ưu đãi",
                  "Lộ trình học tập",
                  "Giảng viên",
                  "Đánh giá học viên",
                  "Câu hỏi thường gặp"
                ].map((item, index) => (
                  <div key={index} className="group flex items-center cursor-pointer">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></div>
                    <span className="text-sm text-gray-400 hover:text-white transition-colors duration-200 group-hover:translate-x-1 transform">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Col>

            {/* Contact Information */}
            <Col xs={24} sm={12} lg={8}>
              <h3 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-gray-700/50 relative">
                Liên hệ
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-600"></div>
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <PhoneOutlined className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Hotline</div>
                    <div className="text-white font-semibold text-lg">1900 1234</div>
                  </div>
                </div>

                <div className="flex items-center group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                    <MailOutlined className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Email</div>
                    <div className="text-white font-semibold">support@elearning.com</div>
                  </div>
                </div>

                <div className="flex items-center group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <EnvironmentOutlined className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Địa chỉ</div>
                    <div className="text-white font-semibold">Hà Nội, Việt Nam</div>
                  </div>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 backdrop-blur-sm">
                <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
                  <MessageOutlined className="mr-2 text-blue-400" />
                  Nhận thông báo khóa học mới
                </h4>
                <div className="flex space-x-2">
                  <input 
                    type="email" 
                    placeholder="Email của bạn" 
                    className="flex-1 px-4 py-3 text-sm bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30">
                    Đăng ký
                  </button>
                </div>
              </div>
            </Col>

            {/* Social Media */}
            <Col xs={24} lg={6}>
              <h3 className="text-lg font-semibold text-white mb-6 pb-3 border-b border-gray-700/50 relative">
                Theo dõi chúng tôi
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-red-600"></div>
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: <FacebookFilled />, name: "Facebook", color: "hover:bg-blue-500/20", border: "hover:border-blue-500" },
                  { icon: <YoutubeFilled />, name: "YouTube", color: "hover:bg-red-500/20", border: "hover:border-red-500" },
                  { icon: <TwitterSquareFilled />, name: "Twitter", color: "hover:bg-sky-500/20", border: "hover:border-sky-500" },
                  { icon: <LinkedinFilled />, name: "LinkedIn", color: "hover:bg-blue-400/20", border: "hover:border-blue-400" },
                  { icon: <InstagramFilled />, name: "Instagram", color: "hover:bg-pink-500/20", border: "hover:border-pink-500" },
                  { icon: <MessageOutlined />, name: "Zalo", color: "hover:bg-blue-300/20", border: "hover:border-blue-300" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border border-gray-700/50 bg-white/5 backdrop-blur-sm text-gray-300 hover:text-white hover:scale-105 transition-all duration-300 group ${social.color} ${social.border}`}
                  >
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{social.icon}</span>
                    <span className="text-xs font-medium">{social.name}</span>
                  </a>
                ))}
              </div>

              {/* App Download */}
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-3 font-medium">Tải ứng dụng ngay</p>
                <div className="flex flex-col space-y-3">
                  <button className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 px-4 py-3 rounded-xl text-sm font-semibold border border-gray-700/50 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    📱 App Store
                  </button>
                  <button className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 px-4 py-3 rounded-xl text-sm font-semibold border border-gray-700/50 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    🤖 Google Play
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 py-6 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="px-6 md:px-16 lg:px-24">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                {[
                  "Phương thức thanh toán an toàn",
                  "Bảo mật thông tin",
                  "Chứng nhận GDQT",
                  "Đối tác chiến lược"
                ].map((text, index) => (
                  <span key={index} className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors duration-200 hover:underline underline-offset-4">
                    {text}
                  </span>
                ))}
              </div>
              
              <div className="text-center lg:text-right">
                <div className="text-sm text-gray-400 mb-1 font-medium">
                  © {new Date().getFullYear()} E-Learning Platform. All rights reserved.
                </div>
                <div className="text-xs text-gray-500 flex items-center justify-center lg:justify-end">
                  <span className="animate-pulse">❤️</span>
                  <span className="ml-1">Made for better education</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPages;