import { UserSecret } from "./userSecret.interface";

export interface Group {
    id: string;
    name: string;
    description: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    member: Member[];
    conversation: Conversation[];
    createdBy: UserSecret;
}


interface Member {
    id: string;
    userId: string;
    groupId: string;
    role: 'admin' | 'member';
    joinedAt: string;
}

interface Conversation{
    id: string;
    isGroup: boolean;
    groupId?: string;
    name?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
}