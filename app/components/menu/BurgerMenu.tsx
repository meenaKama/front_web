import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { selectUser } from '@/features/users/userSlice';
import { Selector } from '@/lib/hooks';
import Image from "next/image"
import React from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import DeconnectionButtion from '../DeconnectionButtion';

const BurgerMenu = () => {
   // const user = Selector(selectUser);

    // console.log(user)
    return (
        <div>
            <Sheet>
                <SheetTrigger><RxHamburgerMenu /></SheetTrigger>
                <SheetContent side='left' className='bg-white'>
                    <SheetHeader>
                        <SheetTitle className='border-b-1'>
                            <div className=' relative rounded-full w-[80px] h-[80px] overflow-hidden'>
                               user image
                            </div>
                           user
                        </SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                            <DeconnectionButtion/>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default BurgerMenu