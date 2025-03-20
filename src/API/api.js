// src/services/api.js
import axios from "axios";

const api = axios.create({
  // temp_change
  // baseURL: "http://127.0.0.1:5000",
  baseURL: "https://crowd-funding-backend-cguw.onrender.com",
  timeout: 50000, // Optional: Set a timeout for requests
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Retrieve the token from local storage or session storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token as Bearer token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, logging out...");
      // Add logout logic if needed
    }
    return Promise.reject(error);
  }
);

export default api;
