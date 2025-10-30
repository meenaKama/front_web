import { Notification } from "../interface/notification.interface";

export const filtreNotificationId = (notification: Notification[], id: string):Notification|undefined => {
   
    const result = notification.find(notif => notif.id === id);
    return result
}