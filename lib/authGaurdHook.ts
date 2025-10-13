"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selectUser, selectUserStatus, whoIsLog, setAccessToken } from '@/features/users/userSlice';
import { Dispatch, Selector } from './hooks';

// Ce hook gère la vérification de l'authentification et les redirections
// isPublicRoute: true si la page est accessible sans connexion (ex: /connexion)
export const useAuthGuard = (isPublicRoute: boolean) => {
    const dispatch = Dispatch();
    const router = useRouter();
    const user = Selector(selectUser);
    const status = Selector(selectUserStatus);
    const accessToken = Selector(setAccessToken).payload; // On récupère le token aussi

    const isReady = status !== 'loading' && status !== 'idle'; // Le store a fini son premier cycle de vérification

    // 1. Logique de vérification (lance le thunk si on n'a pas encore vérifié)
    useEffect(() => {
        // Lance whoIsLog uniquement si on est au premier cycle (idle) ou si une tentative a échoué 
        // et qu'un token est présent (l'état Redux est souvent re-monté)
        if (status === 'idle' || (status === 'failed' && accessToken)) {
            // Lance la vérification. Le thunk va chercher le token dans l'état Redux lui-même.
            dispatch(whoIsLog(accessToken) ); 
        }
    }, [dispatch, status, accessToken]);


    // 2. Logique de Redirection
    useEffect(() => {
        if (!isReady) return; // Attendre que la vérification soit terminée (loading, success, ou failed)

        // Cas A : Rediriger l'utilisateur non connecté vers la page de connexion
        if (!isPublicRoute && !user && status === 'failed') {
            console.log("Redirection: Utilisateur non connecté vers /connexion");
            router.replace('/local');
        }

        // Cas B : Rediriger l'utilisateur connecté qui essaie d'accéder à la page de connexion
        if (isPublicRoute && user) {
            console.log("Redirection: Utilisateur déjà connecté vers /");
            router.replace('/');
        }
        
    }, [isReady, user, status, isPublicRoute, router]);

    // Retourne l'état de la session
    return { user, status, isReady };
};