import React from "react";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi2";

interface Props {
    conversation: Conversation & {
        users: Array<User>;
    };
}
const Header: React.FC<Props> = ({ conversation }) => {
    const otherUser = useOtherUser(conversation);
    const statusText = React.useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }
        return "Active";
    }, [conversation]);

    return (
        <div className="bg-white w-full border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 flex justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
                <Link
                    className="lg:hidden block text-sky-500 hover:text-sky-500 transition cursor-pointer"
                    href="/conversations"
                >
                    <HiChevronLeft size={32} />
                </Link>
            </div>
        </div>
    );
};

export default Header;
