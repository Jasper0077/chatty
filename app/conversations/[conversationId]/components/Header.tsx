"use client";

import React from "react";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "@/app/components/Avatar";
import ProfileDrawer from "./ProfileDrawer";

interface Props {
    conversation: Conversation & {
        users: Array<User>;
    };
}
const Header: React.FC<Props> = ({ conversation }) => {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
    const statusText = React.useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }
        return "Active";
    }, [conversation]);

    return (
        <>
            <ProfileDrawer
                conversation={conversation}
                onClose={() => setDrawerOpen(false)}
                isOpen={drawerOpen}
            />
            <div className="bg-white w-full border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 flex justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center">
                    <Link
                        className="lg:hidden block text-sky-500 hover:text-sky-500 transition cursor-pointer"
                        href="/conversations"
                    >
                        <HiChevronLeft size={32} />
                    </Link>
                    <Avatar user={otherUser} />
                    <div className="flex flex-col">
                        <div>{conversation.name || otherUser.name}</div>
                        <div className="text-sm font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={32}
                    onClick={() => setDrawerOpen(true)}
                    className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
                />
            </div>
        </>
    );
};

export default Header;
