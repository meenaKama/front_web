"use client"
import { Button } from '@/components/ui/button';
import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify"
type Inputs = {
    identifiant: string
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
            console.log(data);
            toast.success("Connexion réussie !")
        } catch (error) {
            console.error(error)
            toast.error("Une erreur s'est produite lors de la connexion.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full h-full p-4">
            <input type='text' placeholder='Entrez votre email ou identifiant' id="identifiant" autoComplete="off" {...register("identifiant", { required: true })} className='bg-white w-[90%] h-[40px] mb-4 text-center' />
            {errors.identifiant && <span className='text-red-600'>This field is required</span>}

            <input type='password' placeholder='Entrez votre mot de passe' id="password" autoComplete="off" {...register("password", { required: true })} className='bg-white w-[90%] h-[40px] mb-4 text-center' />
            {errors.password && <span className='text-red-600'>This field is required</span>}


            <Button type="submit" className='bg-white text-black mt-4 w-[60%] shadow-lg shadow-black hover:bg-amber-50'>Connexion</Button>

        </form>
    )
}

export default Login