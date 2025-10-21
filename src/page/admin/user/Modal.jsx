import { Form, Input, Button, Select, message } from "antd";
import { useEffect } from "react";
import { userService } from "../../../service/userService";
import { notyf } from "../../../ultil/notyf";

export default function ModalThemNguoiDung({ onSuccess, selectedUser }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedUser) {
            form.setFieldsValue({
                taiKhoan: selectedUser.taiKhoan,
                hoTen: selectedUser.hoTen,
                email: selectedUser.email,
                soDT: selectedUser.soDT || selectedUser.soDt,
                matKhau: selectedUser.matKhau || "",
                maLoaiNguoiDung: selectedUser.maLoaiNguoiDung || "HV",
            });
        } else {
            form.resetFields();
        }
    }, [selectedUser]);

    const onFinish = async (values) => {
        try {
            const payload = {
                taiKhoan: values.taiKhoan.trim(),
                matKhau: values.matKhau.trim(),
                hoTen: values.hoTen.trim(),
                soDt: values.soDT.trim(),
                maLoaiNguoiDung: values.maLoaiNguoiDung,
                maNhom: "GP01",
                email: values.email.trim(),
            };
            console.log(payload)
            if (selectedUser) {
                await userService.updateUser(payload);
                notyf.success("Cập nhật người dùng thành công!");
            } else {
                await userService.addUser(payload);
                notyf.success("Thêm người dùng thành công!");
            }
            form.resetFields();
            onSuccess?.();
        } catch (error) {
            console.error(error);
            notyf.error(error.response?.data || "Lỗi khi xử lý người dùng!");
        }
    };

    return (
        <div>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Tài khoản"
                        name="taiKhoan"
                        rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
                    >
                        <Input disabled={!!selectedUser} placeholder="Nhập tài khoản..." />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="matKhau"
                        rules={[{ required: !selectedUser, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu..." />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Họ tên"
                        name="hoTen"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                    >
                        <Input placeholder="Nhập họ tên..." />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="Nhập email..." />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Số điện thoại"
                        name="soDT"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                            {
                                pattern: /^[0-9]{9,11}$/,
                                message: "Số điện thoại không hợp lệ!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại..." />
                    </Form.Item>

                    <Form.Item
                        label="Loại người dùng"
                        name="maLoaiNguoiDung"
                        rules={[{ required: true, message: "Vui lòng chọn loại người dùng!" }]}
                    >
                        <Select placeholder="Chọn loại người dùng">
                            <Select.Option value="GV">Giảng viên</Select.Option>
                            <Select.Option value="HV">Học viên</Select.Option>
                        </Select>
                    </Form.Item>
                </div>

                <Button type="primary" htmlType="submit" block className="mt-4">
                    {selectedUser ? "Cập nhật người dùng" : "Thêm người dùng"}
                </Button>
            </Form>
        </div>
    );
}
