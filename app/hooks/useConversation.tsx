import { useParams } from "next/navigation";
import React from "react";

const useConversation = () => {
    const params = useParams();
    const conversationId = React.useMemo<string | string[]>(() => {
        return params?.conversationId ? params?.conversationId : "";
    }, [params?.conversationId]);
    const isOpen = React.useMemo<boolean>(
        () => !!conversationId,
        [conversationId]
    );

    return { isOpen, conversationId };
};

export default useConversation;
