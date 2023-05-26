"use client";

import cn from "classnames";
import React from "react";
import useConversation from "../hooks/useConversation";
import EmptyState from "../components/EmptyState";

const Conversations = () => {
    const { isOpen } = useConversation();
    return (
        <div className={cn("lg:pl-80 h-full", isOpen ? "block" : "hidden")}>
            <EmptyState />
        </div>
    );
};

export default Conversations;
