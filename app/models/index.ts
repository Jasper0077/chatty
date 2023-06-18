import { IconType } from "react-icons";
import { Conversation, Message, User } from "@prisma/client";

export interface ServiceResponse {
    ok: boolean;
    message: string;
    data: any;
    errors: string | null;
}

export interface Route {
    label: string;
    href: string;
    Icon: IconType;
    onClick?: () => void;
    active: boolean;
}

export enum CallStatus {
    CALLING = "CALLING",
    ANSWERED = "ANSWERED",
    CONNECTING = "CONNECTING"
}

export interface Contact {
    id: string;
    name: string;
    avatar: string;
    createdAt: string;
}

export interface CallDescription {
    sdp?: string;
    type: RTCSdpType;
}

export type FullMessage = Message & {
    sender: User;
    seen: User[];
};

export type FullConversation = Conversation & {
    users: User[];
    messages: Array<FullMessage>;
};
