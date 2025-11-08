"use client";
import { selectAccessToken } from '@/features/users/userSlice';
import { Group } from '@/interface/group.interface';
import api from '@/lib/api';
import { useAuthGuard } from '@/lib/authGaurdHook';
import { Selector } from '@/lib/hooks';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md';

function GroupePage() {
    const accessToken = Selector(selectAccessToken);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        const listGroups = async () => {
            try {
                const response = await api.get('/groups', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                });

                console.log('Groups:', response.data.data);
                setGroups(response.data.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        listGroups();
    }, [accessToken]);

    // La page d'accueil est PROTÉGÉE (false)
    const { status, ready } = useAuthGuard(false);

    // Si la vérification est en cours
    if (!ready || status === 'loading') {
        console.log(status)
        return <div className="text-center p-10">Chargement de la session...</div>;
    }



    return (
        <div className='flex flex-col items-center w-full '>
            <div className='flex items-center justify-between m-3.5 w-full px-4'>
                <h1 className='flex items-center m-3.5 gap-3.5'>
                    <Link href="/"><MdArrowBackIosNew size={15} /></Link>
                    <p className='font-bold'>Groupes</p>
                </h1>
                <div className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                    Créer un groupe
                </div>
            </div>
            {groups.length === 0 && <div className="text-center p-10">Vous ne faites partie d&apos;aucun groupe pour le moment.</div>}

        </div>
    )
}

export default GroupePage
