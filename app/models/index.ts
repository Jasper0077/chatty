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

export type FullMessage = Message & {
    sender: User;
    seen: User[];
};

export type FullConversation = Conversation & {
    users: User[];
    messages: Array<FullMessage>;
};
