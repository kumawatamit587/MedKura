import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    // Log timeout and connection errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - backend server may not be responding");
    }
    if (!error.response && error.message === "Network Error") {
      console.error(
        "Network error - cannot reach backend at http://localhost:5000/api",
      );
    }
    return Promise.reject(error);
  },
);

export default api;
