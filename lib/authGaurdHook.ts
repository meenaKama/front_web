"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { selectUser, selectUserStatus, whoIsLog, selectAccessToken } from '@/features/users/userSlice';
import { Dispatch, Selector } from './hooks';

// Ce hook gère la vérification de l'authentification et les redirections
// isPublicRoute: true si la page est accessible sans connexion (ex: /connexion)
export const useAuthGuard = (isPublicRoute: boolean) => {
    const dispatch = Dispatch();
    const router = useRouter();
    const user = Selector(selectUser);
    const status = Selector(selectUserStatus);
    const accessToken = Selector(selectAccessToken) as string; // On récupère le token aussi
    const ready  = Selector((state) => state.user.ready);

   
    // 1. Logique de vérification (lance le thunk si on n'a pas encore vérifié)
    useEffect(() => {
        // Lance whoIsLog uniquement si on est au premier cycle (idle) ou si une tentative a échoué
        // et qu'un token est présent (l'état Redux est souvent re-monté)
        if (!accessToken) {
            return;
        } 
        if (status === 'idle' || (status === 'failed' && accessToken)) {
            // Lance la vérification. Le thunk va chercher le token dans l'état Redux lui-même.
            dispatch(whoIsLog(accessToken) ); 
        }
    }, [dispatch, status, accessToken, ready]);

    

    // 2. Logique de Redirection
    useEffect(() => {
        if (!ready) return // Attendre que la vérification soit terminée (loading, success, ou failed)

        // Cas A : Rediriger l'utilisateur non connecté vers la page de connexion
        if (!isPublicRoute && !user && status === 'failed') {
            console.log("Redirection: Utilisateur non connecté vers /connexion");
            router.replace('/local');
        }

        // Cas B : Rediriger l'utilisateur connecté qui essaie d'accéder à la page de connexion
        if (isPublicRoute && user && status === 'success') {
            console.log("Redirection: Utilisateur déjà connecté vers /");
            router.replace('/');
        }
        
    }, [user, status, isPublicRoute, router, ready]);

    // Retourne l'état de la session
    return { user, status, ready };
};