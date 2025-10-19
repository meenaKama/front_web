"use client"
import { selectAccessToken, selectUser, setUser } from '@/features/users/userSlice';
import Image from 'next/image';
import { Dispatch, Selector } from '@/lib/hooks';
import Link from 'next/link'
import React, { useState } from 'react'
import { MdArrowBackIosNew } from "react-icons/md";
import { LiaMedalSolid } from "react-icons/lia";
import { BsCopy } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";
import { Button } from '@/components/ui/button';
import { Url } from '@/lib/Url';
import api from '@/lib/api';
import { toast, ToastContainer } from 'react-toastify';

const Profil = () => {

    const [openAvatarModal, setOpenAvatarModal] = useState<boolean>(false);
    const [openNomModal, setOpenNomModal] = useState<boolean>(false);
    const [openTelModal, setOpenTelModal] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const user = Selector(selectUser);
    const accessToken = Selector(selectAccessToken);
    const dispatch = Dispatch();

    const handleChangeAvatar = () => {
        setOpenAvatarModal(!openAvatarModal)
    };

    const handleChangeNom = () => {
        setOpenNomModal(!openNomModal)
    };

    const handleChangeTel = () => {
        setOpenTelModal(!openTelModal)
    };

    const handleAvatarSubmit = async () => {
        try {
            // Vérifie qu'un fichier a bien été sélectionné
            if (!avatar) {
                toast.error("Aucune image sélectionnée !");
                return;
            }

            console.log("voila mon avatar : ", avatar)

            const formData = new FormData();
            formData.append("avatar", avatar);

            const response = await api.patch(`${Url.updateUser}/${user?.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true
            });

            dispatch(setUser(response.data.data.updateUserData));
            setOpenAvatarModal(false)
            toast.success("Avatar mis à jour !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'avatar :", error);
            toast.error("Erreur lors de la mise à jour de l'avatar !");
        }
    };

    const handleNomSubmit = async () => {

    };
    const handleTelSubmit = async () => {

    };


    if (!user) return
    return (
        <>
            {/* --------------------------UPDATE AVATAR-------------------------------------------- */}
            {openAvatarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-4">Modification de photo de profil</h2>
                        <p className="mb-2">Veuillez choisir un nouvel avatar :</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setAvatar(file);
                            }}
                            className="border p-2 text-center mb-4 w-full"
                        />
                        <div className="flex justify-center gap-2">
                            <Button onClick={handleAvatarSubmit}>Valider</Button>
                            <Button onClick={() => setOpenAvatarModal(false)} variant="outline">
                                Annuler
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {/* ------------------------------UPDATE NOM----------------------------------------------- */}
            {openNomModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold mb-4">Modification du nom</h2>
                        <p className="mb-2">Veuillez choisir un nouvel nom :</p>
                        <input
                            type="text"
                            onChange={(e) => e.target.value}
                            className="border p-2 text-center mb-4 w-full"
                        />
                        <div className="flex justify-center gap-2">
                            <Button onClick={handleNomSubmit}>Valider</Button>
                            <Button onClick={() => setOpenNomModal(false)} variant="outline">
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
                <section className='flex flex-row items-center w-full bg-gray-500 border justify-between'>
                    <div className='flex  p-2.5 gap-3.5 items-center w-full'>
                        <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden hover:cursor-[url('/icons/pencils.svg')_0_16,pointer]" onClick={handleChangeAvatar}>
                            <Image src={user.avatar} alt='avatar Profil' fill priority sizes='80px' className="object-contain" />
                        </div>
                        <div className='flex flex-col w-[70%]'>
                            <p className='font-bold'>{user.secretName}</p>
                            <p>MID : { }</p>
                            <p>PID : { }</p>
                        </div>
                    </div>

                    <div>
                        <LiaMedalSolid size={80} className='text-yellow-300' />
                    </div>

                </section>

                <section className='flex flex-col w-full items-center'>
                    <div className='flex flex-row w-full items-center border border-blue-700'>
                        <p className='flex w-[40%] bg-blue-700 p-1.5'>Profil</p>
                        <p className='flex w-[60%] p-1.5'>Page public</p>
                    </div>

                    <div className='flex flex-col items-center w-full justify-between'>
                        <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                            <span>Nom affiché</span>
                            <span className='flex gap-3.5' onClick={handleChangeNom}>
                                {user.secretName}
                                <BsPencilSquare className='transition duration-300 ease-in-out hover:scale-110 hover:text-red-500 hover:cursor-pointer' />
                            </span>
                        </p>
                        <p className='flex gap-3.5 items-center w-full justify-between p-3.5'>
                            <span>MID</span>
                            <span className='flex gap-3.5'>
                                {user.id}
                                <BsCopy className='transition duration-300 ease-in-out hover:scale-110 hover:text-red-500 hover:cursor-pointer' />
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
                    </div>
                </section>
            </div>
            <ToastContainer autoClose={2000} />
        </>
    )
}

export default Profil