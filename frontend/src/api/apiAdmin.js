import axios from "axios";

const apiAdmin = axios.create({
  baseURL: "http://159.65.149.205:8000/",
});

apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiAdmin;
