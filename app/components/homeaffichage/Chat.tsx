"use client"
import { selectAccessToken, selectUser } from '@/features/users/userSlice';
import { Message } from '@/interface/message.interface';
import { UserSecret } from '@/interface/userSecret.interface';
import api from '@/lib/api';
import { Selector } from '@/lib/hooks';
import { initSocket } from '@/lib/socket';
import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';


type Props = {
    friendId: string;
}


const Chat: React.FC<Props> = ({ friendId }) => {

    const accessToken = Selector(selectAccessToken);
    const user = Selector(selectUser);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [userSecret, setUserSecret] = useState<UserSecret | null>(null);
    const [friend, setFriend] = useState<UserSecret | null>(null)
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        if (!user) return
        const fetchSecret = async () => {
            const res = await api.post("/users", { userId: user.id }, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
            setUserSecret(res.data.data);
        };
        fetchSecret();
    }, [accessToken, user]);

    // Récupère ou crée la conversation entre les deux utilisateurs
    useEffect(() => {
        if (!accessToken || !friendId) return;

        const getOrCreateConversation = async () => {
            try {
                const response = await api.post(
                    "/conversations",
                    { friendId },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        withCredentials: true,
                    }
                );

                console.log("✅ Conversation récupérée :", response.data.data);
                setConversationId(response.data.data.id);
            } catch (error) {
                console.error("❌ Erreur création/récupération conversation :", error);
            }
        };

        getOrCreateConversation();
    }, [accessToken, friendId]);

    // Initialisation du socket
    useEffect(() => {
        if (!accessToken || !conversationId) return;

        socket.current = initSocket(accessToken);

        socket.current.on("connect", () => {
            console.log("✅ Socket connecté :", socket.current?.id);
            socket.current?.emit("joinConversation", conversationId);
        });

        socket.current.on("newMessage", (data: Message) => {
            console.log("📩 Nouveau message reçu :", data);
            setMessages(prev => {
                const exists = prev.some(m => m.id === data.id);
                if (exists) return prev; // empêche le doublon
                return [...prev, data];
            });
        });

        return () => {
            socket.current?.emit("leaveConversation", conversationId);
            socket.current?.disconnect();
        };
    }, [accessToken, conversationId]);

    useEffect(() => {
        const getFriend = async () => {
            try {
                const response = await api.post("/userSecrets/", {
                    userId: friendId
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    withCredentials: true
                });
                console.log("l'ami en chat est : ", response.data.data)
                setFriend(response.data.data);
            } catch (error) {
                console.error("❌ Erreur lors de la récupartion des données de l'ami :", error);
            }
        };

        getFriend();
    })

    // Envoi d'un message
    const sendMessage = async () => {
        if (!message.trim() || !conversationId) return;

        try {
      /*const res =*/await api.post(
            "/messages",
            { conversationId, content: message, receiverId: friendId },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );

            // const msg = res.data.data as Message;
            // setMessages(prev => [...prev, msg]);
            setMessage("");
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi du message :", error);
        }
    };
    if (!friend) return

    return (
        <div className="max-w-md mx-auto p-4 flex flex-col h-screen">
            <h1 className="text-xl font-bold mb-4">
                💬 Discussion avec {friend.nameSecret}
            </h1>
            <div className="border p-2 h-64 overflow-y-auto mb-4 bg-gray-50 rounded">
                {messages.length > 0 ? (
                    messages.map((m) => (
                        <div
                            key={m.id}
                            className={`my-1 p-2 max-w-[75%] rounded-lg ${m.senderId === userSecret?.ID
                                ? "ml-auto bg-blue-500 text-white text-right"
                                : "mr-auto bg-gray-200 text-black text-left"
                                }`}
                        >
                            {/* Si le message vient de l'autre, on affiche le pseudo */}
                            {m.senderId !== userSecret?.ID && (
                                <p className="text-xs font-semibold text-gray-600 mb-1">
                                    {userSecret?.nameSecret || "Ami"}
                                </p>
                            )}
                            <p>{m.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">Aucun message</p>
                )}
            </div>

            <div className="mt-3 flex gap-2">
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Écris ton message..."
                    className="border flex-1 px-2 py-1 rounded"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                    Envoyer
                </button>
            </div>
        </div>
    )
}

export default Chat