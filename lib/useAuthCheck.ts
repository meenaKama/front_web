"use client"
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dispatch, Selector } from '@/lib/hooks'; // Assurez-vous d'utiliser vos hooks typés
import { selectUser, selectUserStatus, whoIsLog} from '@/features/users/userSlice';


export const useAuthCheck = () => {
    // 🛑 COUPE-CIRCUIT : Garantie que la vérification ne sera lancée qu'une seule fois.
    const hasAttempted = useRef(false); 
    
    const dispatch = Dispatch();
    const user = Selector(selectUser);
    const status = Selector(selectUserStatus);
    const router = useRouter();

    useEffect(() => {
        // Conditions d'arrêt :
        // 1. L'utilisateur est déjà chargé.
        // 2. La vérification a déjà été tentée (réussie ou échouée).
        // 3. Le statut est en cours de chargement (loading) ou a déjà échoué (failed).
        if (user || hasAttempted.current || status === 'loading' || status === 'failed') {
            return;
        }

        // Marque l'appel comme lancé pour empêcher les relances futures.
        hasAttempted.current = true; 

        // 🚀 Lance la vérification d'authentification
        dispatch(whoIsLog())
            .unwrap() // Utilise unwrap pour gérer les rejets dans le .catch
            .then(() => {
                // Si succès (Access Token valide ou Refresh réussi), rediriger.
                router.replace('/dashboard'); 
            })
            .catch(() => {
                // Si échec (401 final), l'intercepteur a déjà mis à jour l'état Redux (logout/status: 'failed').
                // Le hook s'arrête grâce à 'hasAttempted.current' et 'status === "failed"'.
                // L'utilisateur reste sur la page de connexion.
            });

    }, [dispatch, user, status, router]); 

    // Retourne l'état de chargement
    return { isLoading: status === 'loading' }; 
};