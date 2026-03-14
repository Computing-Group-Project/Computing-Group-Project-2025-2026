import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Request interceptor: inject JWT token
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("authData");
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
