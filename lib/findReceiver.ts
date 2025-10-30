import { Message, Receiver } from "@/interface/message.interface";


export const findReceiver = (messages: Message[], senderID:string):Receiver|undefined => {
   
    for (const message of messages) {
    if (message.sender.ID === senderID) return message.receiver;
    if (message.receiver.ID === senderID) return message.sender;
  }

  return undefined;
    
}