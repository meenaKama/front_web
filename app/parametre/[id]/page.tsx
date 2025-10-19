"use client"
import { selectUser } from '@/features/users/userSlice';
import { Selector } from '@/lib/hooks';
import Link from 'next/link';
import React from 'react'
import { MdArrowBackIosNew } from 'react-icons/md';
import Image from 'next/image';
import { LiaMedalSolid } from 'react-icons/lia';


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
                <div className='flex  p-2.5 gap-3.5 items-center w-full'>
                    <div className='relative w-[80px] h-[80px] rounded-full overflow-hidden'>
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

            


        </div>
    )
}

export default Parametre