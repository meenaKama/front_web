import axios from "axios";
//import { store } from "@/app/store";
import { setAccessToken } from "@/features/users/userSlice";

// Variable pour stocker la fonction 'getState' une fois que le store est prêt
let getReduxState: (() => any) | null = null; 

// Nouvelle fonction pour initialiser la récupération de l'état
export const initializeApi = (getStateFunc: () => any) => {
    getReduxState = getStateFunc;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Variables pour gérer la race condition
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; originalRequest: any }[] = [];

// Fonction pour traiter la file d'attente
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      // Met à jour le header pour la requête en file d'attente
      prom.originalRequest.headers["Authorization"] = `Bearer ${token}`;
      prom.resolve(api(prom.originalRequest)); // Rejoue la requête
    }
  });
  failedQueue = [];
};

// 1. Intercepteur de requête (pour ajouter le token initial si besoin)
api.interceptors.request.use(config => {
   // Utilisez getReduxState() au lieu de store.getState()
  const token = getReduxState ? getReduxState().user.accessToken : null; 
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});


// 2. Intercepteur de réponse (avec gestion du 401 et de la file d'attente)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Vérifie le 401 et l'absence de flag _retry
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // A. Si un rafraîchissement est déjà en cours
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        // Met la requête en file d'attente
        failedQueue.push({ resolve, reject, originalRequest });
      });
    }

    // B. Lancement du premier rafraîchissement
    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh"); // Endpoint refresh
      const newAccessToken = data.accessToken;
      
      // Mise à jour de Redux et du token pour la requête actuelle
      store.dispatch(setAccessToken(newAccessToken));
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      // Vider la file d'attente et relancer les requêtes en attente
      processQueue(null, newAccessToken);
      
      return api(originalRequest); // Rejoue la requête originale

    } catch (refreshError) {
      // 3. Échec du refresh (Refresh Token expiré ou volé)
      processQueue(refreshError);
      
      // Redirection vers la page de login (logout)
      window.location.href = "/"; 
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;