"use client";

import cn from "classnames";
import React from "react";
import useConversation from "../hooks/useConversation";
import EmptyState from "../components/EmptyState";

const Home = () => {
    const { isOpen } = useConversation();
    return (
        <div
            className={cn(
                "lg:pl-80 h-full lg:block",
                isOpen ? "block" : "hidden"
            )}
        >
            <EmptyState />
        </div>
    );
};
