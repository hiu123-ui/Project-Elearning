import React, { useEffect, useState } from "react";
import { courseService } from "../../../service/courseService";
import { Card, DatePicker, message, Spin } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
Legend,
} from "recharts";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const DashboardPage = () => {
const [studentByDate, setStudentByDate] = useState([]); // dữ liệu biểu đồ
const [dateRange, setDateRange] = useState([
dayjs().subtract(1, "month"),
dayjs(),
]);
const [loading, setLoading] = useState(false);

const fetchListCourse = async () => {
try {
setLoading(true);
const res = await courseService.getListCourse();
const [start, end] = dateRange;
  // Lọc khóa học trong khoảng ngày
  const filtered = res.data.filter((course) => {
    if (!course.ngayTao) return false;
    const created = dayjs(course.ngayTao, [
      "YYYY-MM-DD",
      "DD/MM/YYYY",
      "YYYY-MM-DDTHH:mm:ss",
    ]);
    if (!created.isValid()) return false;
    return (
      created.isSame(start, "day") ||
      created.isSame(end, "day") ||
      (created.isAfter(start, "day") && created.isBefore(end, "day"))
    );
  });

  console.log("🎯 Tổng khóa học trong khoảng:", filtered.length);

  // Lấy danh sách học viên từng khóa (chạy song song)
  const allStudents = await Promise.all(
    filtered.map(async (course) => {
      try {
        const { data } = await courseService.getListStudentOfCource(course.maKhoaHoc);
        const soHocVien = data?.lstHocVien?.length || 0;
        const created = dayjs(course.ngayTao, [
          "YYYY-MM-DD",
          "DD/MM/YYYY",
          "YYYY-MM-DDTHH:mm:ss",
        ]);
        return {
          ngay: created.format("DD/MM/YYYY"),
          soHocVien,
        };
      } catch (err) {
        console.error("❌ Lỗi lấy học viên:", err);
        return null;
      }
    })
  );

  // Gom số học viên theo ngày
  const counts = {};
  allStudents
    .filter(Boolean)
    .forEach((item) => {
      counts[item.ngay] = (counts[item.ngay] || 0) + item.soHocVien;
    });

  // Chuyển thành mảng để vẽ biểu đồ
  const chartData = Object.entries(counts).map(([ngay, soHocVien]) => ({
    ngay,
    soHocVien,
  }));

  // Sắp xếp theo ngày tăng dần
  chartData.sort(
    (a, b) =>
      dayjs(a.ngay, "DD/MM/YYYY").unix() - dayjs(b.ngay, "DD/MM/YYYY").unix()
  );

  setStudentByDate(chartData);
  console.log("📊 Thống kê học viên theo ngày:", chartData);
} catch (err) {
  console.error("❌ Lỗi fetchListCourse:", err);
} finally {
  setLoading(false);
}
};

useEffect(() => {
fetchListCourse();
}, [dateRange]);

const handleDateChange = (dates) => {
if (!dates || dates.length !== 2) return;
const [start, end] = dates;
if (end.diff(start, "month", true) > 2) {
  message.warning("Vui lòng chọn khoảng tối đa 2 tháng!");
  return;
}

setDateRange(dates);
};

return (
<> <Card title="Chọn mốc thời gian (mặc định: 1 tháng gần nhất)"> <RangePicker
       value={dateRange}
       onChange={handleDateChange}
       format="DD/MM/YYYY"
       allowClear={false}
     /> </Card>

  {loading ? (
    <Spin tip="Đang tải dữ liệu..." style={{ marginTop: 20 }} />
  ) : (
    <Card title="📅 Thống kê số học viên theo ngày" style={{ marginTop: 20 }}>
      {studentByDate.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={studentByDate}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="ngay"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="soHocVien" fill="#1677ff" name="Số học viên" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>Không có dữ liệu học viên trong khoảng ngày này.</p>
      )}
    </Card>
  )}
</>
);
};

export default DashboardPage;
