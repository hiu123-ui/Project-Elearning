import axios from "axios";

const BASE_URL = 'https://elearningnew.cybersoft.edu.vn/api/QuanLyKhoaHoc';


export const axiosCustom=axios.create({
    headers: {
            TokenCybersoft:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjMwLzEyLzIwMzAiLCJIZXRIYW5UaW1lIjoiMzA3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8",
          },
          baseURL: BASE_URL,
})