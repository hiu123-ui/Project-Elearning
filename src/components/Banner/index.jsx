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
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80",
            primaryBtn: "Đăng ký khóa học",
            secondaryBtn: "Xem demo",
            gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))"
        },
        {
            id: 2,
            title: "Nâng cao kỹ năng lập trình",
            subtitle: "Công nghệ hàng đầu",
            desc: "React, NodeJS, Java, Python và nhiều công nghệ hot nhất hiện nay. Đào tạo từ cơ bản đến nâng cao.",
            img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1469&q=80",
            primaryBtn: "Đăng ký khóa học",
            secondaryBtn: "Xem demo",
            gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(59, 130, 246, 0.8))"
        },
        {
            id: 3,
            title: "Trải nghiệm học tập hiện đại",
            subtitle: "Nền tảng chuyên nghiệp",
            desc: "Học mọi lúc, mọi nơi với nền tảng eLearning chuyên nghiệp. Tương tác trực tiếp với giảng viên và học viên.",
            img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1470&q=80",
            primaryBtn: "Đăng ký khóa học",
            secondaryBtn: "Xem demo",
            gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(239, 68, 68, 0.8))"
        },
    ];
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <div className="relative h-[600px] md:h-[800px]">
            <Swiper
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                modules={[Pagination, Navigation, Autoplay, EffectFade]}
                className="banner-swiper h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center scale-120 transition-transform duration-[10000ms] ease-out"
                                style={{ backgroundImage: `url(${slide.img})` }}
                            />
                            {/* Gradient Overlay */}
                            <div
                                className="absolute inset-0"
                                style={{ background: slide.gradient }}
                            />

                            {/* Content */}
                            <div className="relative z-10 max-w-2xl px-6 text-center text-white animate-[slideUp_1s_ease-out]">
                                <div className="mb-3 text-base font-medium uppercase tracking-wider opacity-90">
                                    {slide.subtitle}
                                </div>
                                <h1 className="mb-5 text-3xl font-extrabold leading-tight drop-shadow md:text-5xl">
                                    {slide.title}
                                </h1>
                                <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed opacity-95 md:text-lg">
                                    {slide.desc}
                                </p>
                                <Space size="large" wrap>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<BookOutlined />}
                                        onClick={() => {
                                            navigate("/register");
                                            scrollToTop();
                                        }}
                                        className="h-12 rounded-full border border-white/30 bg-white/20 px-8 text-base font-semibold shadow-lg backdrop-blur transition hover:bg-white/30 hover:-translate-y-0.5"
                                    >
                                        {slide.primaryBtn}
                                    </Button>
                                    <Button
                                        type="default"
                                        size="large"
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => window.open("https://www.youtube.com/@F8VNOfficial/playlists", "_blank")}
                                        className="h-12 rounded-full border-2 border-white/60 bg-transparent px-8 text-base font-medium text-white transition hover:border-white/80 hover:bg-white/10 hover:-translate-y-0.5"
                                    >
                                        {slide.secondaryBtn}
                                    </Button>
                                </Space>
                            </div>

                            {/* Decorative Element */}
                            <div className="absolute bottom-5 right-5 h-24 w-24 rounded-full border-2 border-white/20 animate-[pulse_2s_infinite]" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Tailwind custom keyframes */}
            <style>
                {`
                @keyframes slideUp {
                    from {opacity:0;transform:translateY(30px)}
                    to {opacity:1;transform:translateY(0)}
                }
                @keyframes pulse {
                    0%,100% {transform:scale(1);opacity:.3}
                    50% {transform:scale(1.1);opacity:.6}
                }
                `}
            </style>
        </div>
    );
};

export default BannerPage;
