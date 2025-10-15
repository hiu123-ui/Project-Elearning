import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { courseService } from "../../../service/courseService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ModalThemKhoaHoc({ onClose }) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const { infoUser } = useSelector((state) => state.userSlice);

  // 🧩 Lấy danh mục khóa học
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await courseService.getCategorySelect();
        setCategories(res.data);
      } catch {
        message.error("Không thể tải danh mục khóa học!");
      }
    };
    fetchCategories();
  }, []);
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    const file = e?.fileList?.[0]?.originFileObj;
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
    return e?.fileList;
  };
  const onFinish = async (values) => {
    try {
      const payload = {
        maKhoaHoc: values.maKhoaHoc,
        biDanh: values.tenKhoaHoc.toLowerCase().replace(/\s+/g, "-"),
        tenKhoaHoc: values.tenKhoaHoc,
        moTa: values.moTa || "",
        luotXem: Number(values.luotXem) || 0,
        danhGia: Number(values.danhGia) || 0,
        hinhAnh: fileName,
        maNhom: "GP01",
        ngayTao: values.ngayTao,
        maDanhMucKhoaHoc: values.maDanhMucKhoaHoc,
        taiKhoanNguoiTao: infoUser?.taiKhoan || "admin",
      };
      await courseService.addCourse(payload);
      message.success("✅ Thêm khóa học thành công!");
      const file = values.hinhAnh?.[0]?.originFileObj;
      if (file) {
        const maNhom = values.maNhom || "GP01";
        const tenKhoaHoc = values.tenKhoaHoc.toLowerCase().replace(/\s+/g, "-");
        const extension = file.name.substring(file.name.lastIndexOf("."));
        const renamedFile = new File([file], `${tenKhoaHoc}_${maNhom}${extension}`, { type: file.type });
        await courseService.uploadCourseImage(values.tenKhoaHoc, maNhom, renamedFile);
        message.success("🎉 Hình ảnh đã được tải lên!");
      } else {
        message.warning("⚠️ Chưa chọn ảnh để tải lên!");
      }

      form.resetFields();
      onClose?.();
    } catch (error) {
      console.error("❌ Lỗi khi thêm khóa học:", error.response?.data || error);
      message.error(error.response?.data || "Không thể thêm khóa học!");
    }
  };


  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Mã khóa học"
        name="maKhoaHoc"
        rules={[{ required: true, message: "Vui lòng nhập mã khóa học!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tên khóa học"
        name="tenKhoaHoc"
        rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Danh mục khóa học"
        name="maDanhMucKhoaHoc"
        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
      >
        <Select placeholder="Chọn danh mục">
          {categories.map((cat) => (
            <Select.Option key={cat.maDanhMuc} value={cat.maDanhMuc}>
              {cat.tenDanhMuc}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Mô tả" name="moTa">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        label="Ngày tạo"
        name="ngayTao"
        rules={[{ required: true, message: "Vui lòng nhập ngày tạo!" }]}
      >
        <Input placeholder="VD: 14/10/2025" />
      </Form.Item>

      <Form.Item label="Đánh giá" name="danhGia">
        <Input type="number" />
      </Form.Item>

      <Form.Item label="Lượt xem" name="luotXem">
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Hình ảnh"
        name="hinhAnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>

      {previewImage && (
        <img
          src={previewImage}
          alt="preview"
          className="mt-2 w-32 h-32 object-cover rounded border"
        />
      )}

      <Button type="primary" htmlType="submit" block>
        Thêm khóa học
      </Button>
    </Form>
  );
}
