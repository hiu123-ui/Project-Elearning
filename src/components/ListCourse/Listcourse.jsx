import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListCourseAction } from "../../stores/course";
import { courseService } from "../../service/courseService";
import { Card } from "antd";
import {
  EyeOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const Listcourse = () => {
  const dispatch = useDispatch();
  const listCourse = useSelector((state) => state.courseSlice.listCourse);
  const navigate=useNavigate();
  const fetchListCourse = async () => {
    try {
      const resListcourse=await courseService.getListCourse();
      dispatch(setListCourseAction(resListcourse.data));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchListCourse();
  }, []);

  const handleCourseDetailPage=(courseID)=>{
    navigate(`/detail/${courseID}`);
  }
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // số lượng khóa học mỗi trang

  // Tính toán danh sách hiển thị theo trang
  const paginatedCourses = listCourse?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil((listCourse?.length || 0) / pageSize);

  return (
    <div
      style={{
        paddingTop: "250px",
        paddingRight: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "36px",
              color: "#2c3e50",
              fontWeight: "700",
              marginBottom: "12px",
              letterSpacing: "-0.5px",
            }}
          >
            🚀 Danh Sách Khóa Học
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {paginatedCourses?.map((course) => (
            <Card
            onClick={()=>handleCourseDetailPage(course.maKhoaHoc)}
              key={course.maKhoaHoc}
              hoverable
              cover={
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    alt={course.tenKhoaHoc}
                    src="https://ectimes.wordpress.com/wp-content/uploads/2019/03/cac-ngon-ngu-lap-trinh-pho-bien-2.jpg"
                    style={{
                      height: "200px",
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Course")
                    }
                  />
                </div>
              }
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={{ padding: "20px" }}>
                <Meta
                  title={
                    <h3
                      style={{
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "#1f2937",
                        marginBottom: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      {course.tenKhoaHoc}
                    </h3>
                  }
                  description={
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "16px",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.5",
                        minHeight: "42px",
                      }}
                    >
                      {course.moTa}
                    </p>
                  }
                />

                {/* Stats đơn giản */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#9ca3af",
                    marginBottom: "20px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <EyeOutlined />
                    <span>{course.luotXem?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <TeamOutlined />
                    <span>{course.soLuongHocVien}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <CalendarOutlined />
                    <span>{course.ngayTao}</span>
                  </div>
                </div>

                {/* Button đơn giản */}
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "#4f46e5",
                    color: "white",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#3730a3";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#4f46e5";
                  }}
                >
                  Xem Chi Tiết
                  <ArrowRightOutlined style={{ fontSize: "12px" }} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              marginRight: "12px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #4f46e5",
              background: currentPage === 1 ? "#e5e7eb" : "#4f46e5",
              color: currentPage === 1 ? "#9ca3af" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            Trang trước
          </button>
          <span style={{ fontWeight: "bold", fontSize: "16px", margin: "0 16px" }}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              marginLeft: "12px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #4f46e5",
              background: currentPage === totalPages ? "#e5e7eb" : "#4f46e5",
              color: currentPage === totalPages ? "#9ca3af" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listcourse;