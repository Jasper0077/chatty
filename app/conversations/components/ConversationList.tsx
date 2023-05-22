"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversation } from "@/app/models";
import { Conversation } from "@prisma/client";
import cn from "classnames";
import { useRouter } from "next/navigation";
import React from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";

interface Props {
    initialConversations: Array<FullConversation>;
}

const ConversationList: React.FC<Props> = ({ initialConversations }) => {
    const [conversations, setConversations] =
        React.useState<Array<FullConversation>>(initialConversations);
    const { conversationId, isOpen } = useConversation();
    const router = useRouter();
    return (
        <aside
            className={cn(
                `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
                isOpen ? "hidden" : "block w-full left-0"
            )}
        >
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-100">
                        Message
                    </div>
                    <div className="rounded-full p-2 bg-gray-200 text-gray-600 cursor-pointer hover:opcaity-75 transition">
                        <MdOutlineGroupAdd size={20} />
                    </div>
                </div>
                {conversations.map((conversation) => (
                    <ConversationBox
                        key={conversation.id}
                        conversation={conversation}
                        selected={conversationId === conversation.id}
                    />
                ))}
            </div>
        </aside>
    );
};

export default ConversationList;
