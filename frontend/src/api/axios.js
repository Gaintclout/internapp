

import axios from "axios";

/**
 * Base Axios instance
 */
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Routes that DO NOT require authentication
 */
const PUBLIC_ROUTES = [
  "/auth/register",
  "/auth/request-otp",
  "/auth/verify-otp",
  "/auth/login",
];

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches JWT token for protected routes
 */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("student_token") ||
      localStorage.getItem("token");

    const isPublic = PUBLIC_ROUTES.some((url) =>
      config.url?.startsWith(url)
    );

    console.log("🔎 Request URL:", config.url);
    console.log("🔎 Token found:", token);
    console.log("🔎 Is Public Route:", isPublic);

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token attached →", config.url);
    } else {
      console.log("🔓 Public route →", config.url);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Global API error handler
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("🚫 Network error / Backend unreachable");

      return Promise.reject({
        status: 0,
        message: "Server unreachable. Please try again.",
      });
    }

    const { status, data } = error.response;

    console.error("⚠️ API Error:", status, data);

    /**
     * 401 → Unauthorized
     */
    if (status === 401) {
      console.warn("🔐 Unauthorized — clearing tokens");

      localStorage.removeItem("token");
      localStorage.removeItem("student_token");

      return Promise.reject({
        status: 401,
        message: data?.detail || "Not authenticated",
      });
    }

    /**
     * 400 → Validation / business logic error
     */
    if (status === 400) {
      return Promise.reject({
        status: 400,
        message: data?.detail || "Validation failed",
      });
    }

    /**
     * 403 → Forbidden
     */
    if (status === 403) {
      return Promise.reject({
        status: 403,
        message: "Access denied",
      });
    }

    /**
     * 500+ → Server error
     */
    if (status >= 500) {
      return Promise.reject({
        status,
        message: "Internal server error. Contact admin.",
      });
    }

    return Promise.reject(error);
  }
);

export default api;