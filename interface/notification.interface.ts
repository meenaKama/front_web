
type NotificationType={
    friend_request: "friend_request"; //nouvelle requete
    friend_accept :"friend_accept"//Quand le demande est acceptée
}

type NotifiableType={
    friendship:"friendship"
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
}