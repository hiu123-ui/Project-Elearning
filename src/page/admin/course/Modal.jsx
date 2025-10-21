import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { courseService } from "../../../service/courseService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { notyf } from "../../../ultil/notyf";

export default function ModalThemKhoaHoc({ onSuccess, selectedCourse }) {
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
  useEffect(() => {
    if (selectedCourse) {
      form.setFieldsValue({
        maKhoaHoc: selectedCourse.maKhoaHoc,
        tenKhoaHoc: selectedCourse.tenKhoaHoc,
        moTa: selectedCourse.moTa,
        ngayTao: selectedCourse.ngayTao,
        luotXem: selectedCourse.luotXem,
        danhGia: selectedCourse.danhGia,
        maDanhMucKhoaHoc: selectedCourse.danhMucKhoaHoc?.maDanhMucKhoahoc || "",
      });
      setPreviewImage(selectedCourse.hinhAnh);
    }
  }, [selectedCourse]);

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
      const file = values.hinhAnh?.[0]?.originFileObj;
      let finalFileName = selectedCourse?.hinhAnh;
      if (file) {
        const maNhom = values.maNhom || "GP01";
        const tenKhoaHoc = values.tenKhoaHoc.toLowerCase().replace(/\s+/g, "-");
        const extension = file.name.substring(file.name.lastIndexOf("."));
        finalFileName = `${tenKhoaHoc}_${maNhom}${extension}`;
      }

      const payload = {
        maKhoaHoc: values.maKhoaHoc,
        biDanh: values.tenKhoaHoc.toLowerCase().replace(/\s+/g, "-"),
        tenKhoaHoc: values.tenKhoaHoc,
        moTa: values.moTa || "",
        luotXem: Number(values.luotXem) || 0,
        danhGia: Number(values.danhGia) || 0,
        hinhAnh: finalFileName, // 🔹 Giữ nguyên hình cũ nếu không có file mới
        maNhom: "GP01",
        ngayTao: values.ngayTao,
        maDanhMucKhoaHoc: values.maDanhMucKhoaHoc,
        taiKhoanNguoiTao: infoUser?.taiKhoan || "admin",
      };

      if (selectedCourse) {
        await courseService.updateCourse(payload);
        notyf.success("Cập nhật khóa học thành công!");
      } else {
        await courseService.addCourse(payload);
        notyf.success("Thêm khóa học thành công!");
      }

      if (file) {
        const maNhom = values.maNhom || "GP01";
        const tenKhoaHoc = values.tenKhoaHoc.toLowerCase().replace(/\s+/g, "-");
        const extension = file.name.substring(file.name.lastIndexOf("."));
        const renamedFile = new File([file], `${tenKhoaHoc}_${maNhom}${extension}`, { type: file.type });
        await courseService.uploadCourseImage(values.tenKhoaHoc, maNhom, renamedFile);
        message.success("🎉 Hình ảnh đã được tải lên!");
      }

      form.resetFields();
      setPreviewImage(null);
      onSuccess?.();
    } catch (error) {
      notyf.error(error.response?.data || "Lỗi khi xử lý khóa học!");
      console.error("❌ Error:", error.response?.data || error);
    }
  };


  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        <div className="grid grid-cols-2 gap-4">
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
          <Form.Item
            label="Ngày tạo"
            name="ngayTao"
            rules={[{ required: true, message: "Vui lòng nhập ngày tạo!" }]}
          >
            <Input placeholder="VD: 14/10/2025" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Đánh giá" name="danhGia">
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Lượt xem" name="luotXem">
            <Input type="number" />
          </Form.Item>
        </div>

        <Form.Item label="Mô tả" name="moTa">
          <Input.TextArea rows={3} />
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
            onError={(e) => {
              const img = e.target;
              img.onerror = null; // tránh lặp vô hạn
              const originalSrc = img.src;
              const maNhom = (selectedCourse?.maNhom || "gp01").toLowerCase();

              try {
                // Nếu đã thử thêm _maNhom mà vẫn lỗi thì dùng ảnh mặc định
                if (originalSrc.includes(`_${maNhom}`)) {
                  img.src = "/images/default.jpg";
                  return;
                }

                // Thêm hậu tố _maNhom trước phần mở rộng
                const dotIndex = originalSrc.lastIndexOf(".");
                const fallbackSrc =
                  dotIndex !== -1
                    ? `${originalSrc.substring(0, dotIndex)}_${maNhom}${originalSrc.substring(dotIndex)}`
                    : `${originalSrc}_${maNhom}`;

                img.src = fallbackSrc;

                // Nếu fallback lỗi thì dùng ảnh mặc định
                img.onerror = () => {
                  img.onerror = null;
                  img.src = "/images/default.jpg";
                };
              } catch {
                img.src = "/images/default.jpg";
              }
            }}
          />
        )}
        <Button type="primary" htmlType="submit" block className="mt-4">
          {selectedCourse ? "Cập nhật khóa học" : "Thêm khóa học"}
        </Button>
      </Form>
    </div>
  );
}
