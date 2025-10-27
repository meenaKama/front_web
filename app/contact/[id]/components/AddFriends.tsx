"use client"
import { selectAccessToken } from '@/features/users/userSlice';
import api from '@/lib/api';
import { Selector } from '@/lib/hooks';
import React, { useState } from 'react';
import { IoMdPersonAdd } from "react-icons/io";
import { toast } from 'react-toastify';


const AddFriends = () => {
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [research, setReseach] = useState<string>("");
    const accessToken = Selector(selectAccessToken);


    const handleResearch = async () => {
        setOpenSearch(!openSearch)
        if (openSearch) {
            try {
                 await api.post("/friends/send", {
                    friendId: research
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    withCredentials: true
                });

                setReseach("")
            } catch (error) {
                console.error("Une erreur s'est produite lors de l'ajout d'ami : ", error);
                toast.error("Une erreur s'est produite lors de l'ajout d'ami")
            }
        }

    }

    const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
        // Vérifie si la touche pressée est 'Enter' (le code 13 est souvent utilisé)
        if (e.key === 'Enter') {

            e.preventDefault();
            handleResearch();
            setOpenSearch(false);
        }
    };



    return (
        <div className='flex items-center gap-3.5'>
            <IoMdPersonAdd size={26} className='hover:scale-110' onClick={handleResearch} />
            {openSearch && <input
                type="search"
                name="searchFriend" id="searchFriend"
                className='border'
                placeholder='Entrez le MID du contact'
                onChange={e => setReseach(e.target.value)}
                value={research}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            }

        </div>
    )
}

export default AddFriends