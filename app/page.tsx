"use client"
import { useAuthGuard } from '@/lib/authGaurdHook';
import React from 'react'
import Menu from './components/menu/Menu';
import Groupes from './components/groupe/Groupes';

const HomePage = () => {
    // La page d'accueil est PROTÉGÉE (false)
    const { user, status, isReady } = useAuthGuard(false);

    // Si la vérification est en cours
    if (!isReady || status === 'loading') {
        return <div className="text-center p-10">Chargement de la session...</div>;
    }

    // Si on est 'failed' et qu'on est sur cette page, useAuthGuard nous redirige.

    // Si on arrive ici, l'utilisateur est présent  



    return (
        <section className='flex flex-row w-full min-h-dvh border items-center'>
            <Menu />
            <Groupes/>
            HomePage
        </section>
    )
}

export default HomePage;