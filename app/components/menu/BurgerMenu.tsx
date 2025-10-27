import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { selectUser } from '@/features/users/userSlice';
import { Selector } from '@/lib/hooks';
import Image from "next/image"
import React from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import DeconnectionButtion from '../DeconnectionButtion';
import { CgProfile } from "react-icons/cg";
import { GrGroup } from "react-icons/gr";
import { RiContactsLine } from "react-icons/ri";
import { IoCallOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link';


const BurgerMenu = () => {
    const user = Selector(selectUser);

    if (!user) return

    return (
        <div className='p-0 bg-gray-700 flex w-full items-start justify-center h-full '>
            <Sheet>
                <SheetTrigger><RxHamburgerMenu /></SheetTrigger>
                <SheetContent side='left' className='bg-white flex w-1/2'>
                    <SheetHeader>
                        <SheetTitle className=' px-3.5'>
                            <div className='flex items-center gap-3.5 py-1.5 '>
                                <div className='relative rounded-full w-[60px] h-[60px] overflow-hidden'>
                                    <Image src={user.avatar as string} alt='photo de profil' fill priority sizes='150px' />
                                </div>
                                <p>{user.name}</p>
                            </div>

                            <span className='flex w-full border-b-1'></span>
                        </SheetTitle>
                        <SheetDescription className='flex flex-col w-full items-center px-3.5'>
                            <Link href={`/profil/${user.id}`} className='flex items-center gap-3.5 w-full h-[40px] hover:font-bold'>
                                <span className='text-xl'><CgProfile /></span>
                                <span>Mon profil</span>
                            </Link>
                            <span className='flex w-full border-b-1'></span>
                            <Link href="" className='flex items-center gap-3.5 w-full h-[40px] hover:font-bold'>
                                <span className='text-xl'><GrGroup /></span>
                                <span>Nouveau groupe</span>
                            </Link>
                            <Link href={`/contact/${user.id}`} className='flex items-center gap-3.5 w-full h-[40px] hover:font-bold'>
                                <span className='text-xl'><RiContactsLine /></span>
                                <span>Contacts</span>
                            </Link>
                            <Link href="" className='flex items-center gap-3.5 w-full h-[40px] hover:font-bold'>
                                <span className='text-xl'><IoCallOutline /></span>
                                <span>Appels</span>
                            </Link>
                            <Link href={`/parametre/${user.id}`} className='flex items-center gap-3.5 w-full h-[40px] hover:font-bold'>
                                <span className='text-xl'><IoSettingsOutline /></span>
                                <span>Paramètres</span>
                            </Link>
                            <DeconnectionButtion />
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default BurgerMenu