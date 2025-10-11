// /lib/api.ts
import axios from "axios";
import { store } from "@/app/store";
import { setAccessToken } from "@/features/users/userSlice";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // nécessaire pour cookie HttpOnly
});

// Intercepteur pour renouvellement automatique
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh"); // endpoint refresh
        store.dispatch(setAccessToken(data.accessToken));
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest); // relancer la requête originale
      } catch {
        window.location.href = "/"; // redirection si refresh invalide
      }
    }
    return Promise.reject(error);
  }
);

export default api;
