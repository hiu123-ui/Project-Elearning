import React, { useEffect } from "react";
import { Button, Form, Input, Typography, Card, Alert } from "antd";
import { userService } from "../../service/userService";
const { Title, Text } = Typography;
import { useDispatch, useSelector } from 'react-redux';
import { setInfoUser, clearError, loginUser } from '../../stores/user'; // Thêm import loginUser
import { keyLocalStorage } from "../../ultil/localStorage";
import { useNavigate } from 'react-router-dom';
import { LocalStorage } from "../../ultil/localStorage";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userSlice);
  const [form] = Form.useForm();

  // Clear error khi component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Clear error khi người dùng bắt đầu nhập (cách đơn giản hơn)
  useEffect(() => {
    if (error) {
      const handleInput = () => {
        dispatch(clearError());
      };

      const inputs = form.getFieldsValue();
      Object.keys(inputs).forEach(key => {
        const inputElement = document.querySelector(`[name="${key}"]`);
        if (inputElement) {
          inputElement.addEventListener('input', handleInput);
        }
      });

      return () => {
        Object.keys(inputs).forEach(key => {
          const inputElement = document.querySelector(`[name="${key}"]`);
          if (inputElement) {
            inputElement.removeEventListener('input', handleInput);
          }
        });
      };
    }
  }, [error, dispatch, form]);

  const onFinish = async (values) => {
    try {
      console.log("Attempting login:", values);
      
      // Sử dụng async thunk thay vì gọi service trực tiếp
      const resultAction = await dispatch(loginUser(values));
      
      if (loginUser.fulfilled.match(resultAction)) {
        // Đăng nhập thành công
        const userInfo = resultAction.payload;
        dispatch(setInfoUser(userInfo));
        LocalStorage.set(keyLocalStorage.INFO_USER, userInfo);
        console.log("Login successful:", userInfo);
        navigate("/");
      } else {
        // Lỗi đã được xử lý trong extraReducers, không cần làm gì thêm
        console.log("Login failed with error:", resultAction.payload);
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
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
          background: "rgba(99, 102, 241, 0.4)",
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
          background: "rgba(168, 85, 247, 0.4)",
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
          border: error ? '1px solid #ff4d4f' : 'none' // Thêm border đỏ khi có lỗi
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: error ? '#ff4d4f' : 'inherit' }}>
            Đăng nhập
          </Title>
          {error && (
            <Text type="danger" style={{ fontSize: '12px', marginTop: '4px' }}>
              Có lỗi xảy ra khi đăng nhập
            </Text>
          )}
        </div>

        {/* Hiển thị lỗi nổi bật ở đầu form */}
        {error && (
          <Alert
            message="Lỗi đăng nhập"
            description={error}
            type="error"
            showIcon
            style={{ 
              marginBottom: 24,
              borderRadius: '8px',
              border: '1px solid #ff4d4f',
              backgroundColor: '#fff2f0'
            }}
            closable
            onClose={() => dispatch(clearError())}
          />
        )}

        <Form
          form={form}
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
            validateStatus={error ? "error" : ""}
            help={error ? " " : null} // Giữ khoảng trống để không làm form nhảy
          >
            <Input 
              placeholder="Nhập tài khoản" 
              style={{ 
                borderColor: error ? '#ff4d4f' : '#d9d9d9',
                backgroundColor: error ? '#fff2f0' : 'white'
              }}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Mật khẩu"
            name="matKhau"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            validateStatus={error ? "error" : ""}
            help={error ? " " : null}
          >
            <Input.Password 
              placeholder="••••••••" 
              style={{ 
                borderColor: error ? '#ff4d4f' : '#d9d9d9',
                backgroundColor: error ? '#fff2f0' : 'white'
              }}
            />
          </Form.Item>

          {/* Submit button */}
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={loading}
              danger={!!error} // Nút chuyển màu đỏ khi có lỗi
              size="large"
              style={{
                height: '40px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>

        {/* Đăng ký */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text>
            Chưa có tài khoản?{" "}
            <a 
              href="/register" 
              style={{ 
                fontWeight: 'bold', 
                color: error ? '#ff4d4f' : '#1890ff',
                textDecoration: 'underline'
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Đăng ký ngay
            </a>
          </Text>
        </div>

        {/* Thông báo debug (chỉ hiển thị trong môi trường development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div style={{ 
            marginTop: 16, 
            padding: 8, 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: 6,
            fontSize: 12
          }}>
            <Text type="secondary">Debug: {error}</Text>
          </div>
        )}
      </Card>

      {/* Toast notification cho lỗi (tùy chọn) */}
      {error && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            backgroundColor: '#ff4d4f',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.4)',
            zIndex: 1000,
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <strong>Lỗi đăng nhập:</strong> {error}
          <button 
            onClick={() => dispatch(clearError())}
            style={{
              marginLeft: 10,
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Thêm CSS animation */}
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .shake-on-error {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;