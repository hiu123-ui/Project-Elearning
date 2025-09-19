import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderPages = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            <header style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 32px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                position: "relative"
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => window.location.href = "/"}>
                    <span style={{ fontWeight: "bold", fontSize: 20, color: "#1890ff" }}>ELEARNING</span>
                </div>

                {/* Desktop Menu */}
                <nav className="desktop-nav" style={{ display: "flex", gap: 24 }}>
                    <a href="/" style={{ color: "#1890ff", fontWeight: 500, textDecoration: "none" }}>Trang chủ</a>
                    <div
                        style={{ position: "relative" }}
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                    >
                        <a
                            href="#"
                            style={{ color: "#333", fontWeight: 500, textDecoration: "none", marginLeft: 24 }}
                            onClick={e => e.preventDefault()}
                        >
                            Khóa học
                        </a>
                        {showMenu && (
                            <div style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                background: "#6ec6ca",
                                padding: "12px 24px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                zIndex: 10,
                                minWidth: 220
                            }}>
                                <div style={{ marginBottom: 8 }}>LẬP TRÌNH BACKEND</div>
                                <div style={{ marginBottom: 8 }}>THIẾT KẾ WEB</div>
                                <div style={{ marginBottom: 8 }}>LẬP TRÌNH DI ĐỘNG</div>
                                <div style={{ marginBottom: 8 }}>LẬP TRÌNH FRONT END</div>
                                <div style={{ marginBottom: 8 }}>LẬP TRÌNH FULL STACK</div>
                                <div>TƯ DUY LẬP TRÌNH</div>
                            </div>
                        )}
                    </div>
                    <a href="/blog" style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>Blog</a>
                    <a href="/events" style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>Sự kiện</a>
                    <a href="/info" style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>Thông tin</a>
                </nav>

                {/* Search + Actions - Desktop */}
                <div className="desktop-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        style={{ 
                            padding: "6px 12px", 
                            borderRadius: 20, 
                            border: "1px solid #ccc" 
                        }} 
                    />
                    <button 
                        style={{ 
                            background: "#1890ff", 
                            color: "#fff", 
                            border: "none", 
                            borderRadius: 20, 
                            padding: "6px 18px", 
                            fontWeight: 500, 
                            cursor: "pointer" 
                        }} 
                        onClick={() => window.location.href = "/login"}
                    >
                        Đăng nhập
                    </button>
                    <button 
                        style={{ 
                            background: "#ffb300", 
                            color: "#fff", 
                            border: "none", 
                            borderRadius: 20, 
                            padding: "6px 18px", 
                            fontWeight: 500, 
                            cursor: "pointer" 
                        }} 
                        onClick={() => window.location.href = "/register"}
                    >
                        Đăng ký
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-btn"
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        padding: "5px"
                    }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="mobile-menu-overlay"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 1000,
                        display: "none"
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div 
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "280px",
                            height: "100%",
                            background: "#fff",
                            boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
                            padding: "20px",
                            overflowY: "auto"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <div style={{ textAlign: "right", marginBottom: "20px" }}>
                            <button 
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    cursor: "pointer"
                                }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <div style={{ marginBottom: "20px" }}>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm..." 
                                style={{ 
                                    width: "100%",
                                    padding: "8px 12px", 
                                    borderRadius: 20, 
                                    border: "1px solid #ccc",
                                    boxSizing: "border-box"
                                }} 
                            />
                        </div>

                        {/* Mobile Navigation */}
                        <nav style={{ marginBottom: "20px" }}>
                            <div style={{ marginBottom: "15px" }}>
                                <a href="/" style={{ color: "#1890ff", fontWeight: 500, textDecoration: "none", fontSize: "16px" }}>
                                    Trang chủ
                                </a>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <div style={{ color: "#333", fontWeight: 500, fontSize: "16px", marginBottom: "8px" }}>
                                    Khóa học
                                </div>
                                <div style={{ paddingLeft: "15px" }}>
                                    <div style={{ marginBottom: 6, fontSize: "14px", color: "#666" }}>LẬP TRÌNH BACKEND</div>
                                    <div style={{ marginBottom: 6, fontSize: "14px", color: "#666" }}>THIẾT KẾ WEB</div>
                                    <div style={{ marginBottom: 6, fontSize: "14px", color: "#666" }}>LẬP TRÌNH DI ĐỘNG</div>
                                    <div style={{ marginBottom: 6, fontSize: "14px", color: "#666" }}>LẬP TRÌNH FRONT END</div>
                                    <div style={{ marginBottom: 6, fontSize: "14px", color: "#666" }}>LẬP TRÌNH FULL STACK</div>
                                    <div style={{ fontSize: "14px", color: "#666" }}>TƯ DUY LẬP TRÌNH</div>
                                </div>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <a href="/blog" style={{ color: "#333", fontWeight: 500, textDecoration: "none", fontSize: "16px" }}>
                                    Blog
                                </a>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <a href="/events" style={{ color: "#333", fontWeight: 500, textDecoration: "none", fontSize: "16px" }}>
                                    Sự kiện
                                </a>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <a href="/info" style={{ color: "#333", fontWeight: 500, textDecoration: "none", fontSize: "16px" }}>
                                    Thông tin
                                </a>
                            </div>
                        </nav>

                        {/* Mobile Actions */}
                        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
                            <button 
                                style={{ 
                                    width: "100%",
                                    background: "#1890ff", 
                                    color: "#fff", 
                                    border: "none", 
                                    borderRadius: 20, 
                                    padding: "10px", 
                                    fontWeight: 500, 
                                    cursor: "pointer",
                                    marginBottom: "10px",
                                    fontSize: "16px"
                                }} 
                                onClick={() => {
                                   navigate("/login");
                                }}
                            >
                                Đăng nhập
                            </button>
                            <button 
                                style={{ 
                                    width: "100%",
                                    background: "#ffb300", 
                                    color: "#fff", 
                                    border: "none", 
                                    borderRadius: 20, 
                                    padding: "10px", 
                                    fontWeight: 500, 
                                    cursor: "pointer",
                                    fontSize: "16px"
                                }} 
                                onClick={() => {
                                    navigate("/register");
                                }}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* Desktop - Màn hình lớn hơn 1024px */
                @media (min-width: 1025px) {
                    .desktop-nav {
                        display: flex !important;
                    }
                    .desktop-actions {
                        display: flex !important;
                    }
                    .mobile-menu-btn {
                        display: none !important;
                    }
                    .mobile-menu-overlay {
                        display: none !important;
                    }
                }

                /* Tablet - Từ 769px đến 1024px */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .desktop-nav {
                        display: flex !important;
                    }
                    .desktop-actions {
                        display: flex !important;
                    }
                    .mobile-menu-btn {
                        display: none !important;
                    }
                    .mobile-menu-overlay {
                        display: none !important;
                    }
                    header {
                        padding: 10px 20px !important;
                    }
                    .desktop-nav {
                        gap: 16px !important;
                    }
                    .desktop-actions input {
                        width: 120px !important;
                    }
                    .desktop-actions button {
                        padding: 6px 12px !important;
                        font-size: 14px !important;
                    }
                }

                /* Mobile - Màn hình nhỏ hơn 768px */
                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .desktop-actions {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    .mobile-menu-overlay {
                        display: block !important;
                    }
                    header {
                        padding: 10px 16px !important;
                    }
                }

                /* Mobile nhỏ - Màn hình nhỏ hơn 480px */
                @media (max-width: 480px) {
                    header span {
                        font-size: 18px !important;
                    }
                    .mobile-menu-overlay > div {
                        width: 100% !important;
                    }
                }

                /* Các hiệu ứng hover cho desktop */
                @media (min-width: 769px) {
                    .desktop-nav a:hover {
                        color: #1890ff !important;
                        transition: color 0.3s ease;
                    }
                    .desktop-actions button:hover {
                        opacity: 0.9;
                        transform: translateY(-1px);
                        transition: all 0.3s ease;
                    }
                    .desktop-actions input:focus {
                        outline: none;
                        border-color: #1890ff;
                        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                    }
                }
            `}</style>
        </>
    );
};

export default HeaderPages