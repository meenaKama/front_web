"use client"
import { useAuthGuard } from '@/lib/authGaurdHook';
import React, { useEffect, useRef } from 'react'
import Menu from './components/menu/Menu';
import Groupes from './components/groupe/Groupes';
import { Dispatch, Selector } from '@/lib/hooks';
import { selectAccessToken } from '@/features/users/userSlice';
import { addNotification, getNotification } from '@/features/notifications/notificationSlice';
import { Socket } from 'socket.io-client';
import { initSocket } from '@/lib/socket';
import { toast } from 'react-toastify';
import Chat from './components/homeaffichage/Chat';



const HomePage = () => {
    const dispatch = Dispatch();
    const accessToken = Selector(selectAccessToken);
    const socket = useRef<Socket | null>(null);


    useEffect(() => {
        if (!accessToken) return
        dispatch(getNotification(accessToken))
    }, [accessToken, dispatch]);


    useEffect(() => {
        socket.current = initSocket(accessToken);
        socket.current.on('newNotification', (notif) => {
            dispatch(addNotification(notif));
            toast.info(`🔔 Nouvelle notification : ${notif.type}`);
        });
        
        return () => {
            socket.current?.off('newNotification')
        }
    },[accessToken, dispatch])


    // La page d'accueil est PROTÉGÉE (false)
    const { status, ready } = useAuthGuard(false);

    // Si la vérification est en cours
    if (!ready || status === 'loading') {
        return <div className="text-center p-10">Chargement de la session...</div>;
    }

    return (
        <section className='flex flex-row w-full min-h-full border items-start'>
            <Menu />
            <Groupes />
        </section>
    )
}

export default HomePage;