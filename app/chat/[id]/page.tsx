/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Selector } from "@/lib/hooks";
import { selectAccessToken, selectUserSecret } from "@/features/users/userSlice";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { UserSecret } from "@/interface/userSecret.interface";
import { Message } from "@/interface/message.interface";
import Image from "next/image";
import { MdArrowBackIos, MdPhone } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import Link from "next/link";
import { findReceiver } from "@/lib/findReceiver";

const imageUrl = "/assets/bg/bg_baobab.webp";

export default function ChatPage() {
  const router = useRouter();
  const { id } = useParams();
  const conversationId = id as string;
  const accessToken = Selector(selectAccessToken);
  const userSecret = Selector(selectUserSecret)
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [friend, setFriend] = useState<UserSecret | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);


  /* -----------------  Identifier si l'id est un friendId ou une conversationId ------------------ */
  useEffect(() => {
    if (!accessToken || !id) return;

    const fetchOrCreateConversation = async () => {
      try {
        // On essaie d'abord de charger les messages → si OK, c'est une conversation existante
        const response = await api.get(`/messages/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        const messages: Message[] = response.data.data;
        const receiver = findReceiver(messages, userSecret?.ID as string);
        if (receiver) setFriend(receiver)

      } catch (err: any) {
        console.error("Erreur création ou récupération de la conversation :", err);
      }

    };

    fetchOrCreateConversation();
  }, [accessToken, id, router, userSecret?.ID]);


  /* ----------------- 3️⃣ Charger les messages ------------------ */
  useEffect(() => {
    if (!accessToken || !conversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${conversationId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setMessages(response.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des messages :", error);
      }
    };

    fetchMessages();
  }, [accessToken, conversationId]);


  /* -----------------  Socket ------------------ */
  useEffect(() => {

    if (!accessToken || !conversationId) return;

    const socket = getSocket();

    if (!socket) return

    console.log("on verra ce que donne socket : ", socket);

    socket.emit("joinConversation", conversationId)

    socket.on("newMessage", (data: Message) => {
      setMessages((prev) => {
        console.log("📩 Message reçu par Socket.IO instantanément :", data); // Ajoutez ce log
        const exists = prev.some((m) => m.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    return () => {
      socket.emit("leaveConversation", conversationId);
      socket.off("newMessage", (data: Message) => {
        setMessages((prev) => {
          console.log("📩 Message reçu par Socket.IO instantanément :", data); // Ajoutez ce log
          const exists = prev.some((m) => m.id === data.id);
          if (exists) return prev;
          return [...prev, data];
        });
      });
    };
  }, [accessToken, conversationId]);

  /* -----------------  Envoi message ------------------ */
  const sendMessage = async () => {
    if (!message.trim() || !conversationId) return;
    setMessage("");


    try {
      await api.post(
        "/messages",
        { conversationId, content: message },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  /* -----------------  Auto-scroll ------------------ */
  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: hasScrolledInitially ? "smooth" : "auto",
    });
    if (!hasScrolledInitially) setHasScrolledInitially(true);
  }, [messages, hasScrolledInitially]);

  /* ----------------- UI ------------------ */
  if (!conversationId)
    return <div className="text-center p-10">Chargement du chat...</div>;


  return (
    <div className="max-w-md mx-auto flex flex-col h-screen w-full">
      {/* ------- Header du chat ------- */}
      <h1 className="text-xl font-bold flex items-center w-full h-[70px] gap-3.5 border-b">
        <Link href="/" className="p-4">
          <MdArrowBackIos size={25} className="hover:text-2xl" />
        </Link>
        <div className="flex w-full items-center justify-end gap-3.5 p-4">
          {friend && <p className="mr-3.5">{friend?.nameSecret}</p>}
          <p className="bg-gray-500 rounded-full w-[30px] h-[30px] items-center flex justify-center">
            <MdPhone />
          </p>
          <p className="bg-gray-500 rounded-full w-[30px] h-[30px] items-center flex justify-center">
            <FaVideo />
          </p>
          {friend?.avatarSecret && (
            <p className="relative w-[60px] h-[60px] rounded-full overflow-hidden">
              <Image
                src={friend.avatarSecret}
                alt={`Photo de ${friend.nameSecret}`}
                priority
                fill
                sizes="80px"
              />
            </p>
          )}
        </div>
      </h1>

      {/* ------- Zone des messages ------- */}
      <div
        className="relative border p-2 h-64 overflow-y-auto bg-cover bg-center rounded flex-grow"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-white/30 pointer-events-none" />
        <div className="relative z-10">
          {messages.length > 0 ? (
            messages.map((m, index) => {
              const previous = messages[index - 1];
              const isNewGroup = !previous || previous.senderId !== m.senderId;

              return (
                <div key={m.id} className={`mb-2 ${isNewGroup ? "mt-3" : ""}`}>
                  {/* Affiche le nom uniquement quand le sender change */}
                  {isNewGroup && (
                    <p
                      className={`text-sm font-semibold mb-1 ${m.senderId === userSecret?.ID
                        ? "text-right text-blue-600"
                        : "text-left text-blue-600"
                        }`}
                    >
                      {m.senderId === userSecret?.ID
                        ? ""
                        : m.receiver?.nameSecret || friend?.nameSecret || "Inconnu"}
                    </p>
                  )}

                  {/* Contenu du message */}
                  <div
                    className={`p-2 max-w-[75%] rounded-lg ${m.senderId === userSecret?.ID
                      ? "ml-auto bg-blue-500 text-white text-right"
                      : "mr-auto bg-gray-200 text-black text-left"
                      }`}
                  >
                    <p>{m.content}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">Aucun message</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ------- Input ------- */}
      <div className="flex gap-2 p-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écris ton message..."
          className="border flex-1 px-2 py-1 rounded"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );

};
