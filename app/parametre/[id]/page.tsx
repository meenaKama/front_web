"use client"
import { selectUser } from '@/features/users/userSlice';
import { Selector } from '@/lib/hooks';
import Link from 'next/link';
import React from 'react'
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import Image from 'next/image';
import { GrDocumentUser, GrDocumentText, GrDocumentStore, GrDocumentLocked, GrDocumentVerified } from "react-icons/gr";
import { IoExtensionPuzzleOutline } from 'react-icons/io5';
import { RiWallet3Line } from 'react-icons/ri';
import { CiTrophy } from "react-icons/ci";



const Parametre = () => {
    const user = Selector(selectUser);

    if (!user) return
    return (
        <div className='flex flex-col w-full min-h-full items-start'>

            <h1 className='flex items-center m-3.5 gap-3.5'>
                <Link href="/"><MdArrowBackIosNew size={15} /></Link>
                <p className='font-bold'>Paramètres</p>
            </h1>
            <section className='flex flex-row items-center w-full bg-gray-500 border justify-between'>
                <div className='flex  p-1.5 gap-3.5 items-center w-full'>
                    <div className='relative w-[80px] h-[80px] rounded-full overflow-hidden'>
                        <Image src={user.avatar} alt='avatar Profil' fill priority sizes='80px' className="object-contain" />
                    </div>
                    <div className='flex flex-col w-[70%]'>
                        <p className='font-bold'>{user.name}</p>
                        <p>MID : { }</p>
                        <p>PID : {user.id }</p>
                    </div>
                </div>

                <Link href="/parametre/user">
                    <MdArrowForwardIos size={45} className='transition duration-300 ease-in-out hover:scale-120 hover:text-gray-900' />
                </Link>

            </section>

            <div className='flex flex-col items-center w-full'>
                <h2 className='flex w-full items-center font-bold text-xl my-[20px] md:my-[40px] px-3.5'>Conditions et Politiques</h2>

                <Link href="/parametre/regleCommunautaire" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <GrDocumentVerified size={20} />
                        <span>Règles communautaires</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="/parametre/conditionUtilisation" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5' >
                        <GrDocumentText size={20} />
                        <span>Conditions d&apos;utilisations</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <GrDocumentStore size={20} />
                        <span>Politiques et confidentialité</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <GrDocumentLocked size={20} />
                        <span>Points importants sur la confidentialité</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <GrDocumentUser size={20} />
                        <span>Politique sur la propriété intellectuelle</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>

                <h2 className='flex w-full items-center font-bold text-xl my-[20px] md:my-[40px]  px-3.5'>Avantages et Services</h2>

                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <CiTrophy size={20} />
                        <span>Programme de récompenses</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <IoExtensionPuzzleOutline size={20} />
                        <span>Extensions et Autres services</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>
                <Link href="" className='bg-gray-500 flex flex-row items-center justify-between w-[90%] rounded-3xl p-1.5 mb-3.5 transition duration-300 ease-in-out hover:scale-105 hover:font-bold'>
                    <p className='flex gap-3.5 px-2.5'>
                        <RiWallet3Line size={20} />
                        <span>Portefeuille</span>
                    </p>
                    <MdArrowForwardIos size={25} />
                </Link>

            </div>
        </div>
    )
}

export default Parametre