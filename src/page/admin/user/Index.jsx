import React, { useEffect, useState } from "react";
import { Modal, Pagination } from "antd";
import { userService } from "../../../service/userService";
import ModalThemNguoiDung from "./Modal";
import UserTable from "./UserTable";
import { notyf } from "../../../ultil/notyf";
import Swal from "sweetalert2";
import { courseService } from "../../../service/courseService";

const UserPageAdmin = () => {
  const [allUsers, setAllUsers] = useState([]); // toàn bộ danh sách
  const [users, setUsers] = useState([]); // danh sách theo trang API
  const [filteredUsers, setFilteredUsers] = useState([]); // danh sách hiển thị
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dataList, setDataList] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const pageSize = 10;

  // 🧩 Lấy toàn bộ người dùng (cho tìm kiếm)
  const fetchAllUsers = async () => {
    try {
      const res = await userService.getListUser();
      console.log(res.data)
      setAllUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 🧩 Lấy người dùng theo trang
  const fetchUserPagination = async (page) => {
    try {
      const res = await userService.getListUserPagination(page);
      setUsers(res.data.items || []);
      setFilteredUsers(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
      setDataList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // gọi API khi load trang hoặc đổi page
  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchUserPagination(page);
    }
  }, [page]);

  // gọi toàn bộ khi load trang (cho tìm kiếm)
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // 🧩 Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setSearchPage(1);

    if (value.trim() === "") {
      fetchUserPagination(page);
      return;
    }

    const filtered = allUsers.filter(
      (user) =>
        user.taiKhoan.toLowerCase().includes(value) ||
        user.hoTen.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value)
    );
    console.log(allUsers);

    setFilteredUsers(filtered);
    setTotalCount(filtered.length);
    if (filtered.length > 0) {
      notyf.success("Tìm kiếm thành công!");
    } else {
      notyf.error("Không tìm thấy người dùng phù hợp!");
    }
  };

  // 🧩 Modal
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    fetchUserPagination(page);
    fetchAllUsers();
  };

  // 🧩 Xử lý xóa
  const handleDelete = async (taiKhoan) => {
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
        await userService.deleteUser(taiKhoan);
        notyf.success("Xóa người dùng thành công!");
        if (searchTerm.trim() === "") {
          await fetchUserPagination(page);
        } else {
          await fetchAllUsers();
          const filtered = allUsers.filter(
            (user) =>
              user.taiKhoan.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.hoTen.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredUsers(filtered);
          setTotalCount(filtered.length);
        }
      } catch (error) {
        notyf.error(error.response.data);
      }
    }
  };

  // 🧩 Xử lý sửa
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 🧩 Dữ liệu hiển thị
  const displayUsers =
    searchTerm.trim() === ""
      ? filteredUsers
      : filteredUsers.slice(
        (searchPage - 1) * pageSize,
        searchPage * pageSize
      );

  return (
    <div>
      <h3 className="text-3xl mb-6">Quản Lý Người Dùng</h3>

      <div className="mt-3 mb-6 w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 font-semibold text-lg">
          <button
            onClick={showModal}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Thêm Người Dùng
          </button>

          {/* Ô tìm kiếm */}
          <div className="text-sm">
            <input
              type="text"
              placeholder="Nhập tài khoản, họ tên hoặc email..."
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

        {/* Table danh sách người dùng */}
        <UserTable
          users={displayUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Footer phân trang */}
        <div className="px-4 py-2 border-t border-gray-200 flex justify-center">
          {searchTerm.trim() === "" ? (
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalCount}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          ) : (
            <Pagination
              current={searchPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={(p) => setSearchPage(p)}
              showSizeChanger={false}
            />
          )}
        </div>

        {/* Modal thêm/sửa người dùng */}
        <Modal
          title={selectedUser ? "Cập Nhật Người Dùng" : "Thêm Mới Người Dùng"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <ModalThemNguoiDung
            selectedUser={selectedUser}
            onSuccess={handleSuccess}
          />
        </Modal>
      </div>
    </div>
  );
};

export default UserPageAdmin;
