import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { logout, setAccessToken } from "@/features/users/userSlice";

// --- Variables Globales pour l'Intercepteur ---

// 1. État de rafraîchissement : S'assurer qu'une seule tentative de refresh est en cours.
let isRefreshing = false;
// 2. File d'attente : Stocker les requêtes 401 en attente pendant le refresh.
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    originalRequest: AxiosRequestConfig;
}> = [];

// 3. Fonctions Redux : Pour accéder à l'état et le modifier.
let dispatchFunc: ((action: any) => any) | null = null;
let getStateFunc: (() => any) | null = null;

// --- Initialisation de l'API ---

/**
 * Initialise l'API avec les fonctions du store Redux pour les intercepteurs.
 */
export const initializeApi = (dispatch: (action: any) => any, getState: () => any) => {
    dispatchFunc = dispatch;
    getStateFunc = getState;
};

// Instance de base d'Axios
const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL as string,
    withCredentials: true, // 🛑 CRUCIAL : Permet l'envoi du Refresh Cookie (HTTP-Only)
});

// --- Gestion de la File d'Attente (Utility) ---

/**
 * Traite la file d'attente des requêtes qui ont échoué avec 401.
 */
const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            // Mise à jour de l'Access Token et re-tentative de la requête originale
            if (prom.originalRequest.headers) {
                prom.originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            // 🛑 Rejoue la requête
            prom.resolve(api(prom.originalRequest)); 
        }
    });
    failedQueue = [];
};

// -------------------------------------------------------------------------------------------------
// 1. Intercepteur de Requête (Ajout de l'Access Token)
// -------------------------------------------------------------------------------------------------

api.interceptors.request.use(config => {
    const state = getStateFunc ? getStateFunc() : null;
    const token = state?.user?.accessToken;
    
    // Ajoute l'Access Token si disponible
    if (token && config.headers && !config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// -------------------------------------------------------------------------------------------------
// 2. Intercepteur de Réponse (Gestion du 401 et Refresh)
// -------------------------------------------------------------------------------------------------

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // 1. Si l'erreur n'est PAS un 401, la propager.
        // Ou si la requête était pour le refresh, l'échec est définitif.
        if (error.response?.status !== 401 || originalRequest._retry) {
            // Si le refresh lui-même échoue (token expiré ou révoqué), on déconnecte.
            if (originalRequest.url === '/refresh' && dispatchFunc) {
                 dispatchFunc(logout());
                 window.location.href = "/"; // Redirection après échec définitif du refresh
            }
            return Promise.reject(error);
        }
        
        // 2. L'erreur est un 401 (Access Token expiré)
        originalRequest._retry = true; // Marque la requête pour éviter les boucles
        
        // 3. Logique de Rafraîchissement (si un refresh n'est pas déjà en cours)
        if (!isRefreshing) {
            isRefreshing = true;
            console.log('Access Token expiré. Tentative de refresh...');
            
            try {
                // 🛑 L'appel ici utilise le Refresh Cookie (HttpOnly) envoyé par le navigateur
                const response = await api.post("/refresh"); 
                // ⚠️ VÉRIFIER LE NOM DE LA CLÉ ICI : Est-ce data.accessToken ou data.data ?
                const newAccessToken = response.data.accessToken || response.data.data; 

                if (!newAccessToken) {
                    throw new Error("Refresh token success, but no new access token found.");
                }

                // A. Mise à jour de Redux (pour les futures requêtes)
                if (dispatchFunc) {
                    dispatchFunc(setAccessToken(newAccessToken)); 
                }
                
                // B. Traitement de la file d'attente et déblocage
                processQueue(null, newAccessToken);
                
                // C. Réinitialisation du statut de rafraîchissement
                isRefreshing = false;
                
                // D. Mise à jour du header de la requête originale pour la re-tentative immédiate
                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }
                
                // 🛑 Rejoue la requête originale (celle qui a déclenché le 401)
                return api(originalRequest); 
            } catch (err) {
                // Le refresh a échoué (token expiré/révoqué)
                isRefreshing = false;
                processQueue(err); // Rejette toutes les promesses en attente
                
                // Déconnexion après échec définitif du refresh
                if (dispatchFunc) {
                    dispatchFunc(logout());
                    window.location.href = "/";
                }
                return Promise.reject(err);
            }
        }
        
        // 4. Si un refresh est déjà en cours, mettre la requête en file d'attente
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, originalRequest });
        });
    }
);

export default api;