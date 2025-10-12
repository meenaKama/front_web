'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '@/features/users/userSlice';
import { whoIsLog } from '@/features/users/userSlice'; // Pour charger les données user
import { Dispatch } from '@/lib/hooks';

const OAuthCallbackPage = () => {
    const router = useRouter();
    const dispatch = Dispatch();

    useEffect(() => {
        // Le Hash (partie après le # dans l'URL) contient le token
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            // 1. Stocker l'Access Token en mémoire via votre action Redux
            dispatch(setAccessToken(accessToken));

            // 2. Déclencher le chargement des données utilisateur
            // Cet appel utilise l'Access Token nouvellement stocké (et vérifie que le Refresh Token est posé)
            dispatch(whoIsLog())
                .unwrap() // Gère la promesse du thunk
                .then(() => {
                    // 3. Rediriger vers le dashboard après succès
                    router.replace('/dashboard');
                })
                .catch(error => {
                    console.error("Échec de whoIsLog après OAuth:", error);
                    // Rediriger vers login en cas d'erreur
                    router.replace('/login?error=oauth_profile_load_failed');
                });
        } else {
            // Pas de token dans l'URL (échec de l'OAuth)
            router.replace('/login?error=oauth_failed');
        }
    }, [dispatch, router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Finalisation de la connexion sécurisée...</p>
        </div>
    );
};

export default OAuthCallbackPage;