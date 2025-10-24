import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setInfoUser } from '../stores/user';
import { notyf } from '../ultil/notyf';
const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem(<NavLink to="/admin">Thống Kê</NavLink>, '/admin', <PieChartOutlined />),
  getItem(<NavLink to="/admin/course">Quản Lý Khóa Học</NavLink>, '/admin/course', <PieChartOutlined />),
  getItem(<NavLink to="/admin/user">Quản Lý Người Dùng</NavLink>, '/admin/user', <PieChartOutlined />),
];
const AdminTemplate = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { infoUser } = useSelector((state) => state.userSlice);
  const handleLogout = () => {
    localStorage.removeItem("INFO_USER");
    dispatch(setInfoUser(null));
    notyf.success("Đăng xuất thành công");
    navigate("/login");
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="demo-logo-vertical" >logo</div>
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <div className='mb-5 bg-white h-[75px] py-3 px-5'>
          <div className='flex justify-between items-center'>
            <div className='logo'>
              <div
                className="font-bold text-xl lg:text-2xl text-blue-500 tracking-wide cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={() => handleNavigate("/")} // CẬP NHẬT
                onKeyPress={(e) => e.key === "Enter" && handleNavigate("/")} // CẬP NHẬT
                tabIndex={0}
                role="button"
                aria-label="Trang chủ"
              >
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  E-LEARNING
                </span>
              </div>
            </div>
            <div className="relative group">
              <div className='flex items-center gap-4 cursor-pointer'>
                <span>Xin Chào, {infoUser?.hoTen}</span>
                <img className='w-[40px] h-40px] rounded shadow' src="/images/avt.png" alt="avatar" />
              </div>
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                <div className="px-4 py-2 text-gray-700">{infoUser?.hoTen}<br />{infoUser?.taiKhoan}</div>
                <hr />
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/profile");
                }} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sửa hồ sơ</a>
                <button onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded p-5 h-full mx-5">
          <Outlet />
        </div>
      </Layout>
    </Layout>
  )
}

export default AdminTemplate
