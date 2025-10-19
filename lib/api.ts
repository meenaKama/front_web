import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { logout, setAccessToken } from "@/features/users/userSlice";

// --- Variables globales pour l'intercepteur ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  originalRequest: AxiosRequestConfig;
}> = [];

let dispatchFunc: ((action: any) => any) | null = null;
let getStateFunc: (() => any) | null = null;

// Initialisation de l'API avec Redux
export const initializeApi = (dispatch: (action: any) => any, getState: () => any) => {
  dispatchFunc = dispatch;
  getStateFunc = getState;
};

// Création de l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true, // ⚡ Important pour les cookies HttpOnly
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------------------------------------------------------------------------
// Fonction utilitaire : traite la file d’attente des requêtes bloquées pendant le refresh
// -------------------------------------------------------------------------------------------
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      if (prom.originalRequest.headers) {
        prom.originalRequest.headers["Authorization"] = `Bearer ${token}`;
      }
      prom.resolve(api(prom.originalRequest));
    }
  });
  failedQueue = [];
};

// -------------------------------------------------------------------------------------------
// 1️ Intercepteur de requêtes : injecte le token d'accès s'il existe
// -------------------------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const state = getStateFunc ? getStateFunc() : null;
    const token = state?.user?.accessToken;

    if (token && config.headers && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------------------------------------
// 2️ Intercepteur de réponses : gère le rafraîchissement automatique du token
// -------------------------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Si l'erreur n'est pas un 401, on ne s'en mêle pas
    if (error.response?.status !== 401 || originalRequest._retry) {
      // Si le refresh lui-même échoue, on déconnecte
      if (originalRequest.url?.includes("/refresh") && dispatchFunc) {
        dispatchFunc(logout());
        window.location.href = "/local/connexion";
      }
      return Promise.reject(error);
    }

    // 2. On marque la requête pour éviter les boucles infinies
    originalRequest._retry = true;

    // 3. Si aucun refresh n'est en cours → on le lance
    if (!isRefreshing) {
      isRefreshing = true;
      console.log("⚠️ Access Token expiré — tentative de refresh...");

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken || response.data.data;
        if (!newAccessToken) throw new Error("Aucun access token retourné");

        // Mise à jour de Redux
        if (dispatchFunc) dispatchFunc(setAccessToken(newAccessToken));

        // Traitement de la file d'attente
        processQueue(null, newAccessToken);

        // On rejoue la requête initiale avec le nouveau token
        if (originalRequest.headers)
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.error("❌ Échec du refresh :", err);
        processQueue(err, null);

        if (dispatchFunc) {
          dispatchFunc(logout());
          window.location.href = "/local/connexion";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // 4. Si un refresh est déjà en cours → on met la requête en attente
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, originalRequest });
    });
  }
);

export default api;
