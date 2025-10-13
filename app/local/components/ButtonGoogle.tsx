"use client"
import { Button } from '@/components/ui/button';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const ButtonGoogle = () => {

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/"
    }

    return (
        <div className='mb-3.5 w-full flex items-center justify-center mt-3.5'>
            <Button className='rounded-2xl lg:w-1/2 mx-auto bg-blue-950 hover:bg-slate-50 border text-white' onClick={handleGoogleLogin}>
                <FcGoogle />
                Signin with Google
            </Button>
        </div>
    )
}

export default ButtonGoogle