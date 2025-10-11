"use client"
import { whoIsLog } from '@/features/users/userSlice';
import { Dispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

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
        <div>
            <header>header</header>
            {children}
            <footer>footer</footer>
        </div>
    )
}

export default LAYOUT