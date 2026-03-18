import axios from "axios";

const apiMentor = axios.create({
  baseURL: "http://159.65.149.205:8000/",
});

apiMentor.interceptors.request.use((config) => {
  const token = localStorage.getItem("mentor_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiMentor;
