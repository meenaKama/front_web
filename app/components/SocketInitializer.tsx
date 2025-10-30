"use client";
import { useEffect } from "react";
import { Selector } from "@/lib/hooks";
import { selectAccessToken } from "@/features/users/userSlice";
import { initSocket } from "@/lib/socket";

export default function SocketInitializer() {
  const token = Selector(selectAccessToken);

  useEffect(() => {
    if (token) initSocket(token);
  }, [token]);

  return null; 
}
