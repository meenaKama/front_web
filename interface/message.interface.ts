export interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt?: string;
  read: boolean;
  attachmentUrl?: string;
  receiver: Receiver;
  sender: Sender;
}


interface Sender {
  ID: string;
  avatarSecret: string;
  nameSecret: string;
  userId: string;
}
export interface Receiver {
  ID: string;
  avatarSecret: string;
  nameSecret: string;
  userId: string;
}