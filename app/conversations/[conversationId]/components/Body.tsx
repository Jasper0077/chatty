"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessage } from "@/app/models";
import React from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { cloneDeep, find } from "lodash";

interface Props {
    initialMessages: Array<FullMessage>;
}

const Body: React.FC<Props> = ({ initialMessages }: Props) => {
    const [messages, setMessages] =
        React.useState<Array<FullMessage>>(initialMessages);
    const bottomRef = React.useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    React.useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`, {});
    }, [conversationId]);

    React.useEffect(() => {
        if (Array.isArray(conversationId)) return;
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessage) => {
            axios.post(`/api/conversations/${conversationId}/seen`);
            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }
                return [...current, message];
            });
        };

        const updateMessageHandler = (newMessage: FullMessage) => {
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }
                    return currentMessage;
                })
            );
        };

        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("message:update", updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new");
        };
    }, [conversationId]);

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
