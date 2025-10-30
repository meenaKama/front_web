"use client"
import { selectNotification } from '@/features/notifications/notificationSlice'
import { Selector } from '@/lib/hooks'
import React from 'react';
import { IoIosNotifications } from "react-icons/io";


const Notification = () => {
    const notifications = Selector(selectNotification);

    console.log("voila les notifications : ", notifications)

    return (
        <div>

            {(notifications.length >= 0) && <section>
                <IoIosNotifications size={30} className='text-orange-500'/>
                <p className='relative bottom-[13px] left-[23px] font-bold text-red-500'>{notifications.length}</p>
            </section>}
        </div>
    )
}

export default Notification