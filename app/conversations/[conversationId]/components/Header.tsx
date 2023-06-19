"use client";

import React from "react";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { HiChevronLeft, HiEllipsisHorizontal, HiPhone } from "react-icons/hi2";
import Avatar from "@/app/components/Avatar";
import ProfileDrawer from "./ProfileDrawer";
import useActiveList from "@/app/hooks/useActiveList";
import VideoPlayer from "./VideoPlayer";

interface Props {
    conversation: Conversation & {
        users: Array<User>;
    };
    setVideoPlayer: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header: React.FC<Props> = ({ conversation, setVideoPlayer }) => {
    const otherUser = useOtherUser(conversation);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    const statusText = React.useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }
        return isActive ? "Active" : "Offline";
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
                <div className="flex flex-row items-center justify-end gap-3">
                    <button
                        className="text-sky-500 cursor-pointer"
                        onClick={() => setIsOpen((current) => !current)}
                    >
                        <HiPhone size={32} />
                    </button>
                    <HiEllipsisHorizontal
                        size={32}
                        onClick={() => setDrawerOpen(true)}
                        className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
                    />
                </div>
            </div>
            <VideoPlayer
                conversationId={conversation.id}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default Header;
