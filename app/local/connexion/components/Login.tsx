/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from '@/components/ui/button';
import { setAccessToken } from '@/features/users/userSlice';
import api from '@/lib/api';
import { Dispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify"
type Inputs = {
    email: string
    password: string
}

const Login = () => {

    const router = useRouter();
    const dispatch = Dispatch();

    const [tempToken, setTempToken] = useState<string | null>(null);
    const [twoFACode, setTwoFACode] = useState('');
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);


    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await api.post("/login", data, {
                withCredentials: true,
            });

            //Si un tempToken existe => double authentification requise
            if (response.data.tempToken) {
                setTempToken(response.data.tempToken);
                setIs2FAModalOpen(true);
                toast.info("Veuillez entrer votre code 2FA");
                return;
            }


            const accessToken = response.data.data;
            dispatch(setAccessToken(accessToken));
            toast.success("Connexion réussie !");


            setTimeout(() => {
                router.push("/")
            }, 2000);
        } catch (error: any) {
            console.error(error)
            toast.error(`${error.response.data.message}`)
        }
    }

    const handle2FASubmit = async () => {
        if (!tempToken) return;

        try {
            const response = await api.post("/login2fa",
                { code: twoFACode, tempToken },
                { withCredentials: true }
            );

            const accessToken = response.data.data;
            dispatch(setAccessToken(accessToken));
            toast.success("Double authentification réussie !");
            setIs2FAModalOpen(false);

            setTimeout(() => router.push("/"), 2000);
        } catch (error) {
            console.error(error);
            toast.error("Code 2FA invalide ou expiré.");
        }
    };


    return (
        <>
            {is2FAModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-4">Double authentification</h2>
                        <p className="mb-2">Entrez le code à 6 chiffres de Google Authenticator :</p>
                        <input
                            type="text"
                            maxLength={6}
                            value={twoFACode}
                            onChange={(e) => setTwoFACode(e.target.value)}
                            className="border p-2 text-center mb-4 w-full"
                        />
                        <div className="flex justify-center gap-2">
                            <Button onClick={handle2FASubmit}>Valider</Button>
                            <Button onClick={() => setIs2FAModalOpen(false)} variant="outline">
                                Annuler
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full md:w-1/3 h-full p-4">
                <input type='email' placeholder='Entrez votre email' id="email" autoComplete="off" {...register("email", { required: "Email obligatoire !" })} className='bg-white w-[90%] h-[40px] mb-4 text-center' />
                {errors.email && <span className='text-red-600'>{errors.email.message}</span>}

                <input type='password' placeholder='Entrez votre mot de passe' id="password" autoComplete="off" {...register("password", { required: "Mot de passe obligatoire !" })} className='bg-white w-[90%] h-[40px] mb-4 text-center' />
                {errors.password && <span className='text-red-600'>{errors.password.message}</span>}


                <Button type="submit" className='bg-white text-black mt-4 w-[60%] shadow-lg shadow-black hover:bg-amber-50'>Connexion</Button>
                <ToastContainer autoClose={3000} />
            </form>
        </>
    )
}

export default Login