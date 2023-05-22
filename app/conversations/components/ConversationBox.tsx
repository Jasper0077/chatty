"use client";

import { FullConversation } from "@/app/models";
import React from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import cn from "classnames";
import useOtherUser from "@/app/hooks/useOtherUser";
import { last } from "lodash";
import Avatar from "@/app/components/Avatar";

interface Props {
    conversation: FullConversation;
    selected?: boolean;
}

const ConversationBox: React.FC<Props> = ({
    conversation,
    selected = false
}) => {
    const otherUser = useOtherUser(conversation);
    const session = useSession();
    const router = useRouter();

    const handleClick = React.useCallback(() => {
        router.push(`/conversatons/${conversation.id}`);
    }, [conversation.id, router]);

    const lastMessage = React.useMemo(() => {
        const messages = conversation.messages || [];
        return messages[messages.length - 1];
    }, [conversation]);

    const userEmail = React.useMemo(() => {
        return session?.data?.user?.email;
    }, [session?.data?.user?.email]);

    const hasSeen = React.useMemo(() => {
        if (!lastMessage || !userEmail) {
            return false;
        }
        const seenArray = lastMessage.seen || [];
        return !!seenArray.find((user) => user.email === userEmail);
    }, [lastMessage, userEmail]);

    const lastMessageText = React.useMemo<string>(() => {
        if (lastMessage?.image) {
            return "Sent an image";
        }
        if (lastMessage?.body) {
            return lastMessage.body;
        }
        return "Started a conversation";
    }, [lastMessage]);

    return (
        <div
            onClick={handleClick}
            className={cn(
                "w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer",
                selected ? "bg-neutral-100" : "bg-white"
            )}
        >
            <Avatar user={otherUser} />
        </div>
    );
};

export default ConversationBox;
