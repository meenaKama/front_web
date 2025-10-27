"use client"
import { selectAccessToken, selectUser, selectUserSecret, setUser } from '@/features/users/userSlice';
import { Dispatch, Selector } from '@/lib/hooks';
import Link from 'next/link'
import React, { useState } from 'react'
import { MdArrowBackIosNew } from 'react-icons/md'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'react-toastify';





const TwoFa = () => {

    const dispatch = Dispatch();
    const user = Selector(selectUser);
    const userSecret = Selector(selectUserSecret);
    const accessToken = Selector(selectAccessToken);
    const [qrCode, setQrcode] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false)

    if (!user || !userSecret) return

    const handleStart2FASetup = async () => {

        try {
            const response = await api.post("/2fa/setup", {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            });

            setQrcode(response.data.qrCodeUrl)
            setCode(response.data.secret)
            setOpenQrCodeModal(true)
        } catch (error) {
            console.error("Erreur lors de la mise à jour du  2FA:", error);
            toast.error("Erreur lors de la mise à jour du 2FA !");
        }

    }

    const handleVerify2FA = async () => {
        try {

            if (!token) return

            const response = await api.post("/2fa/verify", {
                token: token
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true,
            });

            dispatch(setUser(response.data.data))
            setOpenQrCodeModal(false)

        } catch (error) {
            console.error("Erreur lors de la validation du 2FA :", error);
            toast.error("Erreur lors de la validation du 2FA !");
        }
    }

    const handleDisable2FA = async () => {
        try {
              const response = await api.patch("/2fa/desactivate2FA", { }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true,
            });

            dispatch(setUser(response.data.data));
            toast.info("La double authentification a bien été désactivée");
            
        } catch (error) {
            console.error("Erreur lors de la désactivation du 2FA :", error);
            toast.error("Erreur lors de la désactivation du 2FA !");
        }
    }

    return (
        <>
            {/**-----------------Model QR Code-------------------------------------- */}
            {openQrCodeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center items-center flex flex-col">
                        <h2 className="text-lg font-bold mb-4">Activivation du double facteur</h2>
                        <p className="mb-2">Veuillez scanner cette image et entrer le code généré :</p>
                        <div className='relative w-[100px] h-[100px]'>
                            <Image src={qrCode} alt={"le qr code de l'authentification à double facteur"} fill priority sizes={"80px"} />
                        </div>
                        <p>{code}</p>
                        <input
                            type="text"
                            onChange={(e) => setToken(e.target.value)}
                            className="border p-2 text-center mb-4 w-full"
                        />
                        <div className="flex justify-center gap-2">
                            <Button onClick={handleVerify2FA}>Valider</Button>
                            <Button onClick={() => setOpenQrCodeModal(false)} variant="outline">
                                Annuler
                            </Button>
                        </div>
                    </div>

                </div>
            )}

            <div className='flex flex-col w-full min-h-full items-start'>
                <h1 className='flex items-center m-3.5 gap-3.5'>
                    <Link href={`/parametre/user`}><MdArrowBackIosNew size={15} /></Link>
                    <p className='font-bold'>Paramètres➡️Utilisateur➡️2Fa</p>
                </h1>
                <section className='flex flex-row items-center w-full bg-gray-500 border justify-between'>
                    <div className='flex  p-1.5 gap-3.5 items-center w-full'>
                        <div className='relative w-[80px] h-[80px] rounded-full overflow-hidden'>
                            <Image src={user.avatar} alt='avatar Profil' fill priority sizes='80px' className="object-contain" />
                        </div>
                        <div className='flex flex-col w-[70%]'>
                            <p className='font-bold'>{user.name}</p>
                            <p>MID : {userSecret.ID}</p>
                            <p>PID : {user.id}</p>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-4 rounded-lg shadow-md flex flex-col w-full items-center justify-center">
                    <h2 className="text-lg font-bold mb-2">🔐 Double authentification</h2>
                    <p className="text-gray-600 mb-4">
                        Sécurise ton compte avec une vérification à deux étapes.
                    </p>

                    {!user.is2FaEnable ? (
                        <button
                            onClick={handleStart2FASetup}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Activer la double authentification
                        </button>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="text-green-600 font-semibold">2FA activée ✅</span>
                            <button
                                onClick={handleDisable2FA}
                                className="text-red-500 underline text-sm hover:cursor-pointer hover:scale-105 hover:font-bold"
                            >
                                Désactiver
                            </button>
                        </div>
                    )}
                </section>

            </div>
        </>
    )
}

export default TwoFa