"use client"
import Link from 'next/link'
import React from 'react'
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md'
import Image from 'next/image';
import { Selector } from '@/lib/hooks';
import { selectUser, selectUserSecret } from '@/features/users/userSlice';



const ParametreUser = () => {
    const user = Selector(selectUser);
    const userSecret = Selector(selectUserSecret);

    if (!user || !userSecret) return


    return (
        <div className='flex flex-col w-full min-h-full items-start'>

            <h1 className='flex items-center m-3.5 gap-3.5'>
                <Link href={`/parametre/${user.id}`}><MdArrowBackIosNew size={15} /></Link>
                <p className='font-bold'>Paramètres➡️Utilisateur</p>
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

            <div>
                TYPE ABONNEMENT
            </div>

            <h2 className='flex w-full items-center font-bold text-xl my-[20px] md:my-[40px] px-3.5'>Sécurité et confidentialité</h2>

            <div className='flex flex-col w-full items-start pl-3.5'>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <span>Gérer l&apos;accès</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="/parametre/user/2Fa" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <span>Sécurité à 2 facteurs</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <span>Changer de mot de passe</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <span>Vérification du compte</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <span>Effacement à distance</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <span>Supprimer le compte</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <span>Récupération du compte</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
            </div>

        </div>
    )
}

export default ParametreUser