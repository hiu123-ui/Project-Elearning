import React, { useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import { courseService } from "../../../service/courseService";
import ModalThemKhoaHoc from "./Modal";
import CourseTable from "./CourseTable";
import { notyf } from "../../../ultil/notyf";
import Swal from "sweetalert2";

const CoursePageAdmin = () => {
  const [allCourses, setAllCourses] = useState([]); // toàn bộ danh sách
  const [courses, setCourses] = useState([]); // danh sách theo trang API
  const [filteredCourses, setFilteredCourses] = useState([]); // danh sách hiển thị
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // phân trang API
  const [searchPage, setSearchPage] = useState(1); // phân trang tìm kiếm
  const [totalCount, setTotalCount] = useState(0);
  const [dataList, setDataList] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;
  const [selectedCourse, setSelectedCourse] = useState(null);
  // 🧩 Lấy toàn bộ dữ liệu (chỉ dùng cho tìm kiếm)
  const fetchListCourse = async () => {
    try {
      const res = await courseService.getListCourse();
      console.log("🚀 ~ fetchListCourse ~ res:", res)
      setAllCourses(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // 🧩 Lấy dữ liệu phân trang mặc định
  const fetchListCoursePagination = async (page) => {
    try {
      const res = await courseService.getListCoursePagination(page);
      setCourses(res.data.items || []);
      setFilteredCourses(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
      setDataList(res.data);
      console.log("data:",res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // gọi API khi load trang hoặc đổi page
  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchListCoursePagination(page);
    }
  }, [page]);

  // gọi allCourses 1 lần duy nhất khi load trang (cho tìm kiếm)
  useEffect(() => {
    fetchListCourse();
  }, []);

  // 🧩 Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setSearchPage(1); // reset về trang đầu khi gõ tìm kiếm
    if (value.trim() === "") {
      // nếu rỗng → quay lại dữ liệu phân trang API
      fetchListCoursePagination(page);
      return;
    }

    // Lọc trong allCourses
    const filtered = allCourses.filter(
      (course) =>
        course.tenKhoaHoc.toLowerCase().includes(value) ||
        course.maKhoaHoc.toLowerCase().includes(value)
    );

    setFilteredCourses(filtered);
    setTotalCount(filtered.length);
    if (filtered.length > 0) {
      notyf.success("Tìm kiếm thành công!");
    } else {
      notyf.error("Không tìm thấy dữ liệu phù hợp!");
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    fetchListCoursePagination(page);
  };
  // 🧩 Dữ liệu hiển thị (tự cắt nếu đang tìm kiếm)
  const displayCourses =
    searchTerm.trim() === ""
      ? filteredCourses // dữ liệu từ API
      : filteredCourses.slice(
        (searchPage - 1) * pageSize,
        searchPage * pageSize
      ); // phân trang
  const handleDelete = async (courseID) => {
    const confirm = await Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await courseService.deleteCource(courseID);
        notyf.success("Xóa Khóa Học Thành Công");
        if (searchTerm.trim() === "") {
          // Nếu không tìm kiếm → gọi lại API phân trang
          await fetchListCoursePagination(page);
        } else {
          // Nếu đang ở chế độ tìm kiếm → tải lại toàn bộ để lọc lại
          await fetchListCourse();
          const filtered = allCourses.filter(
            (course) =>
              course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
              course.maKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredCourses(filtered);
          setTotalCount(filtered.length);
        }
      } catch (error) {
        notyf.error(error.response.data);
      }
    }
  };
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  return (
    <div>
      <h3 className="text-3xl mb-6">
        Quản Lý Khóa Học
      </h3>
      <div className="mt-3 mb-6 w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 font-semibold text-lg">
          <button
            onClick={showModal}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Thêm Khóa Học
          </button>

          {/* Ô tìm kiếm */}
          <div className="text-sm">
            <input
              type="text"
              placeholder="Nhập tên hoặc mã khóa học..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 w-[350px] border rounded-xl shadow-md 
                border-gray-200 bg-gray-50 
                focus:bg-white hover:bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                transition duration-200 ease-in-out"
            />
          </div>
        </div>

        {/* table - list danh sách khóa học */}
        <CourseTable
          courses={displayCourses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssign={(c) => console.log("Ghi danh:", c)}
        />

        {/* Footer - phân trang */}
        <div className="px-4 py-2 border-t border-gray-200 flex justify-center">
          {searchTerm.trim() === "" ? (
            // 🔹 Phân trang API (backend)
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalCount}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          ) : (
            // 🔹 Phân trang frontend (tìm kiếm)
            <Pagination
              current={searchPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={(p) => setSearchPage(p)}
              showSizeChanger={false}
            />
          )}
        </div>
        <Modal
          title="Thêm Mới Khóa Học"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <ModalThemKhoaHoc
            selectedCourse={selectedCourse}
            onSuccess={handleSuccess}
          />
        </Modal>
        {/* Modal thêm khóa học */}
      </div>
    </div>
  );
};

export default CoursePageAdmin;
