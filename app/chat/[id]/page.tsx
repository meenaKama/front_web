"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Selector } from "@/lib/hooks";
import { selectAccessToken, selectUser } from "@/features/users/userSlice";
import api from "@/lib/api";
import { initSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { UserSecret } from "@/interface/userSecret.interface";
import { Message } from "@/interface/message.interface";
import Image from "next/image";
import { MdArrowBackIos, MdPhone } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import Link from "next/link";

const imageUrl = "/assets/bg/bg_baobab.webp";

export default function ChatPage() {
  const router = useRouter();
  const { id } = useParams(); // ← universel
  const accessToken = Selector(selectAccessToken);
  const user = Selector(selectUser);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [friendId, setFriendId] = useState<string | null>(null); // 👈 on garde la vraie valeur du friendId
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [userSecret, setUserSecret] = useState<UserSecret | null>(null);
  const [friend, setFriend] = useState<UserSecret | null>(null);
  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);

  /* ----------------- 1️⃣ Charger le userSecret ------------------ */
  useEffect(() => {
    if (!user || !accessToken) return;
    (async () => {
      const res = await api.post(
        "/users",
        { userId: user.id },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setUserSecret(res.data.data);
    })();
  }, [accessToken, user]);

  /* ----------------- 2️⃣ Identifier si l'id est un friendId ou une conversationId ------------------ */
  useEffect(() => {
    if (!accessToken || !id) return;

    const resolveConversation = async () => {
      try {
        // On tente d'abord de charger les messages avec cet ID
        const response = await api.get(`/messages/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        console.log("'cest une conversationId ? : ", response.status)
        // ✅ Si la requête réussit, c'est bien une conversationId
        if (response.status === 200) {
          setConversationId(id as string);
          return;
        }
      } catch (err) {
        // ❌ Sinon, on considère que c'est un friendId et on crée la conversation
        console.log("Création de la conversation pour friendId :", id);
        const conv = await api.post(
          "/conversations",
          { friendId: id },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        const convId = conv.data.data.id;

        console.log("creation de coversation : ", conv.data.data)

        setConversationId(convId);
        setFriendId(id as string); // on garde le vrai friendId pour les infos
        router.replace(`/chat/${convId}`);
      }
    };

    resolveConversation();
  }, [accessToken, id, router]);

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

  /* ----------------- 4️⃣ Récupérer les infos de l'ami ------------------ */
  useEffect(() => {
    const fetchFriend = async () => {
      if (!accessToken || !friendId) return;
      try {
        const res = await api.post(
          "/userSecrets/",
          { userId: friendId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        setFriend(res.data.data);
      } catch (err) {
        console.error("Erreur récupération ami :", err);
      }
    };
    fetchFriend();
  }, [accessToken, friendId]);

  /* ----------------- 5️⃣ Socket ------------------ */
  useEffect(() => {
    if (!accessToken || !conversationId) return;
    socket.current = initSocket(accessToken);

    socket.current.on("connect", () => {
      socket.current?.emit("joinConversation", conversationId);
    });

    socket.current.on("newMessage", (data: Message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    return () => {
      socket.current?.emit("leaveConversation", conversationId);
      socket.current?.disconnect();
    };
  }, [accessToken, conversationId]);

  /* ----------------- 6️⃣ Envoi message ------------------ */
  const sendMessage = async () => {
    if (!message.trim() || !conversationId) return;
    try {
      await api.post(
        "/messages",
        { conversationId, content: message },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    }
  };

  /* ----------------- 7️⃣ Auto-scroll ------------------ */
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
      <h1 className="text-xl font-bold flex items-center w-full h-[70px] gap-3.5 border-b">
        <Link href="/" className="p-4">
          <MdArrowBackIos size={25} className="hover:text-2xl" />
        </Link>
        <div className="flex w-full items-center justify-end gap-3.5 p-4">
          <p className="mr-3.5">{friend?.nameSecret || "Ami"}</p>
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

      <div
        className="relative border p-2 h-64 overflow-y-auto bg-cover bg-center rounded flex-grow"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-white/30 pointer-events-none" />
        <div className="relative z-10">
          {messages.length > 0 ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`my-1 p-2 max-w-[75%] rounded-lg ${m.senderId === userSecret?.ID
                  ? "ml-auto bg-blue-500 text-white text-right"
                  : "mr-auto bg-gray-200 text-black text-left"
                  }`}
              >
                <p>{m.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucun message</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

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
}
