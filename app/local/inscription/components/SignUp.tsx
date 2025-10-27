/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

type Inputs = {
    email: string
    password: string
    confirmPassword: string
    name: string
}


const SignUp = () => {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}/signup`, {
                email: data.email,
                password: data.confirmPassword,
                name: data.name
            }, {
                withCredentials: true,
            });

            const name =(response.data.data.name)
            toast.success(`Enregistrement réussie ${name}!`);
            setTimeout(() => {
                router.push("/")
            }, 2000);
        } catch (error:any) {
            console.error(error)
            toast.error(`Une erreur s'est produite lors de la connexion. : ${error?.response.data.message}`)
        }
    };

    // On "observe" la valeur du mot de passe
    const password = watch("password");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full md:w-1/3 h-full p-4">
            <input
                type='email'
                placeholder='Entrez votre email'
                id="email"
                autoComplete="off"
                {...register("email", { required: "Email obligatoire !" })}
                className='bg-white w-[90%] h-[40px] mb-4 text-center'
                autoCorrect='true'
                autoFocus
            />
            {errors.email && <span className='text-red-600'>{errors.email.message}</span>}

            <input
                type='texte'
                placeholder='Veuillez choisir un pseudo'
                id="name"
                autoComplete="off"
                {...register("name", { required: "Pseudo obligatoire !" })} className='bg-white w-[90%] h-[40px] mb-4 text-center'
            />
            {errors.name && <span className='text-red-600'>{errors.name.message}</span>}

            <input
                type='password'
                placeholder='Entrez votre mot de passe'
                id="password"
                autoComplete="off"
                {...register("password", { required: "Mot de passe obligatoire !" })}
                className='bg-white w-[90%] h-[40px] mb-4 text-center'
            />
            {errors.password && <span className='text-red-600'>{errors.password.message}</span>}

            <input
                type='password'
                placeholder='Confirmez le mot de passe'
                id="confirmPassword"
                autoComplete="off"
                {...register("confirmPassword", {
                    required: "Veuillez confirmer le mot de passe !",
                    validate: (value) => value === password || "Les mots de passe ne correspondent pas"
                })}
                className='bg-white w-[90%] h-[40px] mb-4 text-center'
            />
            {errors.confirmPassword && <span className='text-red-600'>{errors.confirmPassword.message}</span>}


            <Button type="submit" className='bg-white text-black mt-4 w-[60%] shadow-lg shadow-black hover:bg-amber-50'>Connexion</Button>
            <ToastContainer autoClose={5000} />
        </form>
    )
}

export default SignUp