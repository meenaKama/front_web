"use client"
import { selectAccessToken } from '@/features/users/userSlice';
import { Friend } from '@/interface/friend.interface';
import api from '@/lib/api';
import { Selector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Contact = () => {
    const router = useRouter();
    const [contact, setContact] = useState<Friend[]>([]);
    const accesToken = Selector(selectAccessToken);


    useEffect(() => {
        const getContact = async () => {
            const response = await api.get('/friends/list', {
                headers: {
                    Authorization: `Bearer ${accesToken}`
                },
                withCredentials: true,
            });

            setContact(response.data);
        };

        getContact()

    }, [accesToken]);

    console.log(contact)

    return (
        <div className="flex flex-col w-full min-h-full items-start p-4">
            <h1 className="text-xl font-bold mb-4">📇 Contacts</h1>

            {contact.length === 0 ? (
                <p className="text-gray-500">Aucun contact pour le moment.</p>
            ) : (
                <ul className="w-full space-y-2">
                    {contact.map(friend => (
                        <li
                            key={friend.id}
                            className="flex items-center p-2 border rounded-lg w-full hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push(`/chat/${friend.id}`)}
                        >
                            <img
                                src={friend.avatar || "/default-avatar.png"}
                                alt={friend.name}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <p className="font-semibold">{friend.name}</p>
                                <p className="text-sm text-gray-500">
                                    {friend.status === "online" ? "🟢 En ligne" : "⚪ Hors ligne"}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Contact