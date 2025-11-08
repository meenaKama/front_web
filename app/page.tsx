"use client"
import { useAuthGuard } from '@/lib/authGaurdHook';
import React, { useEffect } from 'react'
import Menu from './components/menu/Menu';
import Groupes from './components/groupe/Groupes';
import { Dispatch, Selector } from '@/lib/hooks';
import { selectAccessToken } from '@/features/users/userSlice';
import { addNotification, getNotification } from '@/features/notifications/notificationSlice';
import { toast} from 'react-toastify';
import { getSocket } from '@/lib/socket';




const HomePage = () => {
    const dispatch = Dispatch();
    const accessToken = Selector(selectAccessToken);
    
    useEffect(() => {
        if (!accessToken) return
        dispatch(getNotification(accessToken))
    }, [accessToken, dispatch]);


    useEffect(() => {
        const socket = getSocket();
        if (!socket) return
        socket.on('newNotification', (notif) => {
            dispatch(addNotification(notif));
            toast.info(`🔔 Nouvelle notification : ${notif.type}`);
        });

        return () => {
            socket.off('newNotification')
        }
    }, [accessToken, dispatch])


    // La page d'accueil est PROTÉGÉE (false)
    const { status, ready } = useAuthGuard(false);

    // Si la vérification est en cours
    if (!ready || status === 'loading') {
        console.log(status)
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