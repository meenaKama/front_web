import { Button } from '@/components/ui/button';
import { logoutAndInvalidate, selectUserStatus } from '@/features/users/userSlice';
import { Dispatch, Selector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import React from 'react';

const DeconnectionButtion = () => {

    const dispatch = Dispatch();
    const router = useRouter();
    const status = Selector(selectUserStatus);
    const isLoading = status === 'loading';

    const handleLogout = async () => {
        // Lance le thunk de déconnexion
        await dispatch(logoutAndInvalidate());

        // Redirection vers la page de connexion après que l'état Redux soit vidé.
        router.replace('/local');
    };

    return (
        <Button
            onClick={handleLogout}
            disabled={isLoading}
            className={`
                px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 
                shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                ${isLoading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}
            `}
        >{isLoading ? 'Déconnexion en cours...' : 'Déconnexion'}</Button>
    )
}

export default DeconnectionButtion