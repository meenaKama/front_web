
type NotificationType="friend_request" |"friend_accept"


type NotifiableType={
    friendship:"friendship"
}


interface NotificationMeta{
  message: string;
}

interface Sender{
  ID: string;
  avatarSecret: string;
  nameSecret: string;
}

interface Receiver{
   ID: string;
  avatarSecret: string;
  nameSecret: string;
}


export interface Notification {
  id: string;
  type: NotificationType;
  targetId: string;
  targetType: NotifiableType;
  read: boolean;
  createdAt: Date;
  delivered: boolean;
  seenAt?: Date;
  receiverId: string;
  senderId: string;
  meta: NotificationMeta;
  sender: Sender;
  receiver: Receiver;
}