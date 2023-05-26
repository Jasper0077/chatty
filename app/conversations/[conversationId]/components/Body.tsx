"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessage } from "@/app/models";
import React from "react";
import MessageBox from "./MessageBox";

interface Props {
    initialMessages: Array<FullMessage>;
}

const Body: React.FC<Props> = ({ initialMessages }: Props) => {
    const [messages, setMessages] =
        React.useState<Array<FullMessage>>(initialMessages);
    const bottomRef = React.useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, index) => {
                return (
                    <MessageBox
                        isLast={index === messages.length - 1}
                        key={message.id}
                        data={message}
                    />
                );
            })}
            <div ref={bottomRef} className="pt-24"></div>
        </div>
    );
};

export default Body;
