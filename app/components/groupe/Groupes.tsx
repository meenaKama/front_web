"use client"
import React, { useEffect, useState } from 'react';
import Notification from '../notification/Notification';
import { useRouter } from 'next/navigation';
import { Selector } from '@/lib/hooks';
import { selectAccessToken } from '@/features/users/userSlice';
import api from '@/lib/api';
import { Friend } from '@/interface/friend.interface';
import Image from "next/image";
import Link from 'next/link';

const Groupes = () => {
  const router = useRouter();
  const [contact, setContact] = useState<Friend[]>([]);
  const accesToken = Selector(selectAccessToken);


  useEffect(() => {
    const getContact = async () => {
      const response = await api.get('/friends/list', {
        headers: {
          Authorization: `Bearer ${accesToken}`
        },
        withCredentials: true,
      });
      console.log(response.data)
      setContact(response.data);
    };

    getContact()

  }, [accesToken]);



  return (
    <div className='flex flex-col min-h-full w-[85%] md:w-[90%] items-center border'>
      <Link href="/notification" className='flex flex-col min-h-full w-full items-center '>
        <Notification />
      </Link>

      {contact.length === 0 ? (
        <p className="text-gray-500">Aucun contact pour le moment.</p>
      ) : (
        <ul className="w-full space-y-2">
          {contact.map(friend => (
            <li
              key={friend.id}
              className="flex items-center p-2 rounded-lg w-full hover:bg-gray-100 cursor-pointer justify-start gap-2.5"
              onClick={() => router.push(`/chat/${friend.id}`)}
            >
              <div className='relative w-[60px] h-[60px] overflow-hidden rounded-full p-2 border'>
                <Image
                  src={friend.avatar || "/default-avatar.png"}
                  alt={friend.name}
                  fill
                  priority
                  sizes='60px'
                />
              </div>
              {/**--------------Nom +Aperçu du dernier Message------------- */}
              <div className='border-b w-full flex flex-col items-start justify-center'>
                <p className="font-bold text-lg">{friend.name}</p>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, repudiandae.</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Groupes;