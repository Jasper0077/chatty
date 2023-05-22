"use client";

import { FullConversation } from "@/app/models";
import React from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import cn from "classnames";
import useOtherUser from "@/app/hooks/useOtherUser";

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

    return <div>Conversation Box</div>;
};

export default ConversationBox;
