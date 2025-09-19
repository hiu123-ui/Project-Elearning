import { axiosCustom } from "./config";

export const courseService={
    getListCourse: ()=>{
        return axiosCustom.get('/LayDanhSachKhoaHoc?MaNhom=GP01');
    },
    getCourseDetail: (courseID)=>{
        return axiosCustom.get(`/LayThongTinKhoaHoc?maKhoaHoc=${courseID}`);
    }
}