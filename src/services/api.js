import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 🔥 INTERCEPTOR GLOBAL
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // 🔒 Email non vérifié
    if (
      status === 403 &&
      message?.toLowerCase().includes("vérifier votre adresse email") &&
      window.location.pathname !== "/verify-email"
    ) {
      window.location.href = "/verify-email";
    }

    return Promise.reject(error);
  },
);

export default api;
