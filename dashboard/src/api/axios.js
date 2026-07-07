import axios from "axios";

// ==========================================
// Axios Instance
// ==========================================

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5001/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// Response Interceptor
// ==========================================

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  },
);

// ==========================================
// FUTURE PHASE: Auth token interceptor
// ==========================================

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;
