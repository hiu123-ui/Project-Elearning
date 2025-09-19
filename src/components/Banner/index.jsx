import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Button, Space } from "antd";
import { PlayCircleOutlined, BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BannerPage = () => {
    const navigate = useNavigate();
    
    const slides = [
        {
            id: 1,
            title: "Học trực tuyến dễ dàng",
            subtitle: "Khám phá tri thức mới",
            desc: "Khám phá hơn 500+ khóa học chất lượng cao cùng giảng viên hàng đầu. Học mọi lúc, mọi nơi với công nghệ hiện đại.",
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
            primaryBtn: "Khám phá khóa học",
            secondaryBtn: "Xem demo",
            gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))"
        },
        {
            id: 2,
            title: "Nâng cao kỹ năng lập trình",
            subtitle: "Công nghệ hàng đầu",
            desc: "React, NodeJS, Java, Python và nhiều công nghệ hot nhất hiện nay. Đào tạo từ cơ bản đến nâng cao.",
            img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
            primaryBtn: "Bắt đầu học",
            secondaryBtn: "Tư vấn miễn phí",
            gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(59, 130, 246, 0.8))"
        },
        {
            id: 3,
            title: "Trải nghiệm học tập hiện đại",
            subtitle: "Nền tảng chuyên nghiệp",
            desc: "Học mọi lúc, mọi nơi với nền tảng eLearning chuyên nghiệp. Tương tác trực tiếp với giảng viên và học viên.",
            img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            primaryBtn: "Dùng thử ngay",
            secondaryBtn: "Tìm hiểu thêm",
            gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(239, 68, 68, 0.8))"
        },
    ];

    return (
        <div style={{ height: "600px"  }}>
            <Swiper
                pagination={{ 
                    clickable: true,
                    dynamicBullets: true
                }}
                navigation={true}
                autoplay={{ 
                    delay: 5000,
                    disableOnInteraction: false
                }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                modules={[Pagination, Navigation, Autoplay, EffectFade]}
                className="banner-swiper"
                style={{
                    height: "800px",
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                    '--swiper-navigation-size': '24px'
                }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {/* Background Image */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `url(${slide.img})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    transform: "scale(1.2)",
                                    transition: "transform 10s ease-out"
                                }}
                            />

                            {/* Gradient Overlay */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: slide.gradient,
                                }}
                            />

                            {/* Content Container */}
                            <div
                                style={{
                                    position: "relative",
                                    zIndex: 2,
                                    color: "#fff",
                                    textAlign: "center",
                                    maxWidth: "800px",
                                    padding: "0 24px",
                                    animation: "slideUp 1s ease-out"
                                }}
                            >
                                {/* Subtitle */}
                                <div
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        marginBottom: "12px",
                                        opacity: "0.9",
                                        letterSpacing: "2px",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    {slide.subtitle}
                                </div>

                                {/* Main Title */}
                                <h1
                                    style={{
                                        fontSize: "clamp(32px, 5vw, 48px)",
                                        fontWeight: "800",
                                        marginBottom: "20px",
                                        lineHeight: "1.2",
                                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
                                    }}
                                >
                                    {slide.title}
                                </h1>

                                {/* Description */}
                                <p
                                    style={{
                                        fontSize: "clamp(16px, 2vw, 20px)",
                                        marginBottom: "32px",
                                        lineHeight: "1.6",
                                        opacity: "0.95",
                                        maxWidth: "800px",
                                        margin: "0 auto 32px"
                                    }}
                                >
                                    {slide.desc}
                                </p>

                                {/* Action Buttons */}
                                <Space size="large" wrap>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<BookOutlined />}
                                        onClick={() => navigate("/courses")}
                                        style={{
                                            height: "48px",
                                            padding: "0 32px",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            borderRadius: "24px",
                                            background: "rgba(255,255,255,0.2)",
                                            backdropFilter: "blur(10px)",
                                            border: "1px solid rgba(255,255,255,0.3)",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                                        }}
                                        className="glassmorphism-btn"
                                    >
                                        {slide.primaryBtn}
                                    </Button>
                                    
                                    <Button
                                        type="default"
                                        size="large"
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => navigate("/demo")}
                                        style={{
                                            height: "48px",
                                            padding: "0 32px",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            borderRadius: "24px",
                                            background: "transparent",
                                            border: "2px solid rgba(255,255,255,0.6)",
                                            color: "#fff"
                                        }}
                                        className="outline-btn"
                                    >
                                        {slide.secondaryBtn}
                                    </Button>
                                </Space>
                            </div>

                            {/* Decorative Elements */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "20px",
                                    right: "20px",
                                    width: "100px",
                                    height: "100px",
                                    border: "2px solid rgba(255,255,255,0.2)",
                                    borderRadius: "50%",
                                    animation: "pulse 3s infinite"
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.6;
                    }
                }

                .glassmorphism-btn:hover {
                    background: rgba(255,255,255,0.3) !important;
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }

                .outline-btn:hover {
                    background: rgba(255,255,255,0.1) !important;
                    border-color: rgba(255,255,255,0.8) !important;
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }

                .banner-swiper .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(255,255,255,0.5);
                    opacity: 1;
                }

                .banner-swiper .swiper-pagination-bullet-active {
                    background: #fff;
                    width: 32px;
                    border-radius: 6px;
                }

                .banner-swiper .swiper-button-next,
                .banner-swiper .swiper-button-prev {
                    background: rgba(255,255,255,0.2);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    backdrop-filter: blur(10px);
                }

                .banner-swiper .swiper-button-next:hover,
                .banner-swiper .swiper-button-prev:hover {
                    background: rgba(255,255,255,0.3);
                }

                @media (max-width: 768px) {
                    .banner-swiper {
                        height: 500px !important;
                    }
                    
                    .banner-swiper .swiper-button-next,
                    .banner-swiper .swiper-button-prev {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .banner-swiper {
                        height: 400px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BannerPage;