"use client"
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

const VerifyEmail = () => {
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        try {
            const validate = async () => {

                await api.get(`/verify-email/${id}`);

                toast("Votre email a été validé !")
                setTimeout(() => {
                    router.push("/")
                }, 2000);
            }

            validate()
        } catch (error) {
            console.log("Une erreur s'est produite lors de la veirification d'email : ", error)
            toast("Une erreur s'est produite lors de la veirification d'email!")
        }

    },[id, router])
    return (
        <div>VerifyEmail</div>
    )
}

export default VerifyEmail