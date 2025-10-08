"use client"
import { Button } from '@/components/ui/button';
import { Url } from '@/lib/Url';
import axios from 'axios';
import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify"
type Inputs = {
    email: string
    password: string
}

const Login = () => {
    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const login = await axios.post(Url.login, data, {
                withCredentials: true,
            })
            console.log(login.data);
            toast.success("Connexion réussie !")
        } catch (error) {
            console.error(error)
            toast.error("Une erreur s'est produite lors de la connexion.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full md:w-1/3 h-full p-4">
            <input type='email' placeholder='Entrez votre email' id="identifiant" autoComplete="off" {...register("email", { required: "Email obligatoire !" })} className='bg-white w-[90%] h-[40px] mb-4 text-center' />
            {errors.email && <span className='text-red-600'>{errors.email.message}</span>}

            <input type='password' placeholder='Entrez votre mot de passe' id="password" autoComplete="off" {...register("password", { required: "Mot de passe obligatoire !" })} className='bg-white w-[90%] h-[40px] mb-4 text-center' />
            {errors.password && <span className='text-red-600'>{errors.password.message}</span>}


            <Button type="submit" className='bg-white text-black mt-4 w-[60%] shadow-lg shadow-black hover:bg-amber-50'>Connexion</Button>

        </form>
    )
}

export default Login