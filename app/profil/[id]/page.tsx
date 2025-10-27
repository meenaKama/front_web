"use client"
import { selectAccessToken, selectUser, setUserSecret } from '@/features/users/userSlice';
import Image from 'next/image';
import { Dispatch, Selector } from '@/lib/hooks';
import Link from 'next/link'
import React, { useState } from 'react'
import { MdArrowBackIosNew } from "react-icons/md";
import { LiaMedalSolid } from "react-icons/lia";
import { BsCopy } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast, ToastContainer } from 'react-toastify';
import { selectUserSecret } from '../../../features/users/userSlice';

const Profil = () => {

    const [openAvatarSecretModal, setOpenAvatarSecretModal] = useState<boolean>(false);
    const [openNomSecretModal, setOpenNomSecretModal] = useState<boolean>(false);
    const [openTelModal, setOpenTelModal] = useState<boolean>(false);
    const [avatarSecret, setAvatarSecret] = useState<File | null>(null);
    const [nomSecret, setNomSecret] = useState<string | null>(null);
    const user = Selector(selectUser);
    const userSecret = Selector(selectUserSecret);
    const accessToken = Selector(selectAccessToken);
    const dispatch = Dispatch();

    const handleChangeAvatar = () => {
        setOpenAvatarSecretModal(!openAvatarSecretModal)
    };

    const handleChangeNomSecret = () => {
        setOpenNomSecretModal(!openNomSecretModal)
    };

    const handleChangeTel = () => {
        setOpenTelModal(!openTelModal)
    };

    const handleAvatarSecretSubmit = async () => {
        try {
            // Vérifie qu'un fichier a bien été sélectionné
            if (!avatarSecret) {
                toast.error("Aucune image sélectionnée !");
                return;
            }


            const formData = new FormData();
            formData.append("avatarSecret", avatarSecret);

            const response = await api.patch(`/userSecrets/${userSecret?.ID}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true
            });

            dispatch(setUserSecret(response.data.data));
            setOpenAvatarSecretModal(false)
            toast.success("Avatar mis à jour !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'avatar :", error);
            toast.error("Erreur lors de la mise à jour de l'avatar !");
        }
    };

    const handleNomSecretSubmit = async () => {
        try {
            // Vérifie qu'un fichier a bien été sélectionné
            if (!nomSecret) {
                toast.error("Aucun nom secret séléctionné !");
                return;
            }


            const response = await api.patch(`/userSecrets/${userSecret?.ID}`, {
                nameSecret: nomSecret
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true
            });

            dispatch(setUserSecret(response.data.data));
            setOpenNomSecretModal(false)
            toast.success("nom secret mis à jour !");

        } catch (error) {
            console.error("Erreur lors de la mise à jour du secretName :", error);
            toast.error("Erreur lors de la mise à jour du secretName !");
        }
    };
    const handleTelSubmit = async () => {

    };


    if (!user) return
    if (!userSecret) return
    return (
        <>
            {/* --------------------------UPDATE AVATARSECRET-------------------------------------------- */}
            {openAvatarSecretModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-4">Modification de photo de profil</h2>
                        <p className="mb-2">Veuillez choisir un nouvel avatar :</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setAvatarSecret(file);
                            }}
                            className="border p-2 text-center mb-4 w-full"
                        />
                        <div className="flex justify-center gap-2">
                            <Button onClick={handleAvatarSecretSubmit}>Valider</Button>
                            <Button onClick={() => setOpenAvatarSecretModal(false)} variant="outline">
                                Annuler
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {/* ------------------------------UPDATE NOMSECRET----------------------------------------------- */}
            {openNomSecretModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-4">Modification du nom</h2>
                        <p className="mb-2">Veuillez choisir un nouvel nom :</p>
                        <input
                            type="text"
                            onChange={(e) => setNomSecret(e.target.value)}
                            className="border p-2 text-center mb-4 w-full"
                        />
                        <div className="flex justify-center gap-2">
                            <Button onClick={handleNomSecretSubmit}>Valider</Button>
                            <Button onClick={() => setOpenNomSecretModal(false)} variant="outline">
                                Annuler
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------UPDATE TELEPHONE-------------------------------------------- */}
            {openTelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-4">Modification du téléphone</h2>
                        <p className="mb-2">Veuillez choisir un nouveau numéro :</p>
                        <input
                            type="text"
                            onChange={(e) => e.target.value}
                            className="border p-2 text-center mb-4 w-full"
                        />
                        <div className="flex justify-center gap-2">
                            <Button onClick={handleTelSubmit}>Valider</Button>
                            <Button onClick={() => setOpenTelModal(false)} variant="outline">
                                Annuler
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------*******------------------------*/}

            <div className='flex flex-col w-full min-h-full items-start'>
                <h1 className='flex items-center m-3.5 gap-3.5'>
                    <Link href="/"><MdArrowBackIosNew size={15} /></Link>
                    <p className='font-bold'>Profil</p>
                </h1>
                <section className='flex flex-col w-full items-center gap-2.5'>

                    {/**Profil privé */}
                    <div className='flex flex-col w-full items-center border border-blue-700'>
                        <p className='flex w-full bg-blue-700 p-1.5 justify-center items-center'>Profil secret</p>
                        <div className='flex flex-col items-center w-full justify-between h-full border-r overflow-hidden'>
                            <section className='flex flex-row items-center w-full bg-gray-500 justify-between'>
                                <div className='flex  p-2.5 gap-3.5 items-center w-full'>
                                    <div className="relative w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden hover:cursor-[url('/icons/pencils.svg')_0_16,pointer]" onClick={handleChangeAvatar}>
                                        <Image src={userSecret.avatarSecret} alt='avatar Profil' fill priority sizes='60px' className="object-contain" />
                                    </div>
                                    <div className='flex flex-col w-[70%]'>
                                        <p className='font-bold'>{userSecret.nameSecret}</p>
                                        <p>MID : {userSecret.ID}</p>
                                        <p>PID : {userSecret.userId}</p>
                                    </div>
                                </div>
                                <div>
                                    <LiaMedalSolid size={80} className='text-yellow-300' />
                                </div>

                            </section>
                            <section className='flex flex-col w-full items-center h-full'>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Nom affiché</span>
                                    <span className='flex gap-3.5' onClick={handleChangeNomSecret}>
                                        {userSecret.nameSecret}
                                        <BsPencilSquare className='transition duration-300 ease-in-out hover:scale-110 hover:text-red-500 hover:cursor-pointer' />
                                    </span>
                                </p>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>MID</span>
                                    <span className='flex gap-3.5 '>
                                        {userSecret.ID}
                                        <BsCopy className='transition duration-300 ease-in-out hover:scale-110 hover:text-red-500 hover:cursor-pointer' />
                                    </span>
                                </p>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Autorisations </span>

                                </p>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Centre des activités </span>
                                </p>
                            </section>

                        </div>

                    </div>

                    {/**Profil public */}
                    <div className='flex flex-col w-full items-center border border-red-500'>
                        <p className='flex w-full p-1.5 items-center justify-center'>Page public</p>
                        <div className='flex flex-col items-center w-full h-full justify-between'>
                            <section className='flex flex-row items-center w-full bg-gray-500 justify-between'>
                                <div className='flex  p-2.5 gap-3.5 items-center w-full'>
                                    <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden hover:cursor-[url('/icons/pencils.svg')_0_16,pointer]">
                                        <Image src={user.avatar} alt='avatar Profil' fill priority sizes='60px' className="object-contain" />
                                    </div>
                                    <div className='flex flex-col w-[70%]'>
                                        <p className='font-bold'>{user.name}</p>
                                        <p>PID : {user.id}</p>
                                    </div>
                                </div>
                            </section>
                            <section className='flex flex-col w-full items-center h-full'>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Nom affiché</span>
                                    <span className='flex gap-3.5'>
                                        {user.name}
                                        <BsPencilSquare className='transition duration-300 ease-in-out hover:scale-110 hover:text-red-500 hover:cursor-pointer' />
                                    </span>
                                </p>

                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Email</span>
                                    <span>{user.email}</span>
                                </p>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Tél portable  </span>
                                    <span className='flex gap-3.5' onClick={handleChangeTel}>
                                        {user.phone}
                                        <BsPencilSquare className='transition duration-300 ease-in-out hover:scale-110 hover:text-red-500 hover:cursor-pointer' />
                                    </span>
                                </p>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Autorisations </span>
                                    <span>{ }</span>
                                </p>
                                <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                                    <span>Centre des activités </span>
                                    <span></span>
                                </p>
                            </section>

                        </div>
                    </div>
                </section>
            </div>
            <ToastContainer autoClose={2000} />
        </>
    )
}

export default Profil