import axios from "axios";
import { keyLocalStorage, LocalStorage } from "../ultil/localStorage";

const BASE_URL = 'https://elearningnew.cybersoft.edu.vn/api';

export const axiosCustom = axios.create({
  baseURL: BASE_URL,
});

// Gắn header động trước mỗi request
axiosCustom.interceptors.request.use((config) => {
  const info = LocalStorage.get(keyLocalStorage.INFO_USER);
  if (info?.accessToken) {
    config.headers.Authorization = `Bearer ${info.accessToken}`;
  }
  // TokenCybersoft cố định theo tài liệu
  config.headers.TokenCybersoft =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NSIsIkhldEhhblN0cmluZyI6IjMwLzEyLzIwMzAiLCJIZXRIYW5UaW1lIjoiMzA3MDc2ODAwMDAwMCIsIm5iZiI6MTc0MzAxMjAwMCwiZXhwIjoxNzcwOTE5MjAwfQ._5a1o_PuNL8CuHuGdsi1TABKYJwuMsnG5uSKAILfaY8";
  return config;
});