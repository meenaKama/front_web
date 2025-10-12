"use client"
import { whoIsLog } from '@/features/users/userSlice';
import { Dispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Menu from './components/menu/Menu';
import Groupes from './components/Groupes';

const LAYOUT = ({ children }: { children: React.ReactNode }) => {

    const dispatch = Dispatch();
    const router = useRouter();

    useEffect(() => {

        const checkUser = async () => {
            try {
                await dispatch(whoIsLog()).unwrap()
                
            } catch (error) {
                router.push("/");
                throw error
            }
        };

        checkUser();
    }, [dispatch, router])



    return (
        <div className='flex flex-row w-full h-dvh'>
            <Menu/>
            <Groupes/>
            {children}
        </div>
    )
}

export default LAYOUT