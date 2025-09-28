import React from "react";
import { Button, Form, Input, Typography, Card } from "antd";
import { userService } from "../../service/userService";
const { Title, Text, Link } = Typography;
import { useDispatch } from 'react-redux';
import { setInfoUser } from '../../stores/user';
import { keyLocalStorage } from "../../ultil/localStorage";
import { useNavigate } from 'react-router-dom';
import { LocalStorage } from "../../ultil/localStorage";
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const onFinish = async (values) => {
    try {
      console.log("Success:", values);
      const res = await userService.login(values);
      console.log(res);
      const InfoUser = res.data;
      dispatch(setInfoUser(InfoUser));
      LocalStorage.set(keyLocalStorage.INFO_USER, InfoUser);  // dùng wrapper đúng
      navigate("/");  // chuyển về trang chủ
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff, #fdf2f8, #f5f3ff)",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Vòng tròn blur trang trí */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.4)", // indigo-500
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(168, 85, 247, 0.4)", // purple-500
          filter: "blur(120px)",
        }}
      />

      {/* Card form */}
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Đăng nhập
          </Title>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{ remember: true }}
        >
          {/* Username */}
          <Form.Item
            label="Tài khoản"
            name="taiKhoan"
            rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
          >
            <Input placeholder="Nhập tài khoản" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Mật khẩu"
            name="matKhau"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          {/* Submit button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Đăng ký */}
        <div style={{ textAlign: "center" }}>
          <Text>
            Chưa có tài khoản?{" "}
            <Link href="/register" strong>
              Đăng ký
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
