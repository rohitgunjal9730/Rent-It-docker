import axios from "axios";

// ========================================
// SINGLE API INSTANCE (Through Gateway)
// ========================================
// All services go through API Gateway (8080)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("� Token added");
    } else {
      console.log("⚠️ No token found");
    }
    // Provide a clear line that indicates whether Authorization header was attached (no token value printed)
    if (config.headers && config.headers.Authorization) {
      console.log("🔒 Authorization header attached");
    } else {
      console.log("🔓 No Authorization header set");
    }
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
      } else if (error.response.status === 403) {
        console.error("Forbidden! Access denied.");
        alert("Access Denied: You do not have permission to access this resource.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
