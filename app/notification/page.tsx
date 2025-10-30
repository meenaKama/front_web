"use client"
import { selectNotification, setNotificationRead } from '@/features/notifications/notificationSlice';
import { Dispatch, Selector } from '@/lib/hooks';
import React from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { FcOk } from 'react-icons/fc';
import { RxCross2 } from 'react-icons/rx';
import { FaCircle } from 'react-icons/fa';
import api from '@/lib/api';
import { selectAccessToken } from '@/features/users/userSlice';
import { filtreNotificationId } from '@/lib/filtreNotificationId';
import { toast, ToastContainer } from 'react-toastify';



const Notification = () => {
    const router = useRouter();
    const notification = Selector(selectNotification);
    const accessToken = Selector(selectAccessToken);
    const dispatch = Dispatch();

    if (!notification) return

    console.log("liste des notifications : ", notification);

    const handleAcceptFriend = async (id: string) => {
        try {
            const notifSelected = filtreNotificationId(notification, id);

            if (!notifSelected) {
                console.log("Aucune notification trouvée.");
                return
            }

            await api.post("friends/accept", {
                requesterId: notifSelected.senderId
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            });

            dispatch(setNotificationRead(id));
            toast("Demande d'amitié acceptée !")

        } catch (error) {
            console.log("Une erreur s'est produite lors de l'acceptation d'amitié : ", error)
        }
    }

    return (
        <div>
            <ul>
                {notification.map((notif) => {
                    return (
                        <li key={notif.id}
                            className='flex items-center gap-52 '
                        >
                            <div
                                onClick={() => router.push(`/notification/${notif.id}`)}
                                className='flex items-center hover:bg-amber-800'>

                                {!notif.read && <p className='text-blue-600'><FaCircle size={13} /></p>}


                                <div className='p-4'>
                                    <p>
                                        {notif.type === "friend_request" && <p>Demande amitié</p>}
                                    </p>
                                    <div className='flex  items-center gap-3.5'>
                                        <div className='relative h-[40px] w-[40px] rounded-full overflow-hidden'>
                                            <Image
                                                src={notif.sender.avatarSecret}
                                                alt={`avatar de ${notif.sender.nameSecret}`}
                                                fill
                                                priority
                                                sizes='40px'
                                            />
                                        </div>
                                        <p>
                                            {notif.sender.nameSecret}
                                        </p>
                                    </div>

                                </div>
                                {notif.createdAt}
                            </div>
                            <div className='flex gap-3.5 hover:scale-125 relative'>
                                <FcOk size={25} onClick={() => handleAcceptFriend(notif.id)} />
                                <p className='text-red-600 font-extrabold'><RxCross2 size={25} /></p>
                                <p>test</p>
                            </div>

                        </li>
                    )
                })}
            </ul>
            <ToastContainer autoClose={3000} />
        </div>
    )
}

export default Notification