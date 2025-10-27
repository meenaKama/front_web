"use client"
import { selectNotification } from '@/features/notifications/notificationSlice'
import { Selector } from '@/lib/hooks'
import React from 'react'

const Notification = () => {


    const notification = Selector(selectNotification);

    console.log("liste des notifications : ", notification);


    return (
        <div>

        </div>
    )
}

export default Notification