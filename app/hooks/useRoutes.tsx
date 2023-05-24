"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";

import useConversation from "@/app/hooks/useConversation";
import { Route } from "@/app/models";

const useRoutes = () => {
    const pathname = usePathname();
    const { conversationId } = useConversation();

    const routes = React.useMemo<Array<Route>>(
        () => [
            {
                label: "Chat",
                href: "/conversations",
                Icon: HiChat,
                active: pathname === "/conversations" || !!conversationId
            },
            {
                label: "Users",
                href: "/users",
                Icon: HiUsers,
                active: pathname === "/users"
            },
            {
                label: "Logout",
                href: "#",
                Icon: HiArrowLeftOnRectangle,
                onClick: () => signOut(),
                active: pathname === "/logout"
            }
        ],
        [pathname, conversationId]
    );
    return routes;
};

export default useRoutes;
