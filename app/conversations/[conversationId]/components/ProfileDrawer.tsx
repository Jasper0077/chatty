"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Dialog, Transition } from "@headlessui/react";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import React from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    conversation: Conversation & {
        users: User[];
    };
}

const ProfileDrawer: React.FC<Props> = ({ isOpen, onClose, conversation }) => {
    const otherUser = useOtherUser(conversation);
    const joinedDate = React.useMemo(() => {
        return format(new Date(otherUser.createdAt), "PP");
    }, [otherUser.createdAt]);
    const title = React.useMemo(() => {
        return conversation.name || otherUser.name;
    }, [conversation.name, otherUser.name]);
    const statusText = React.useMemo(() => {
        conversation.isGroup
            ? `${conversation.users.length} members`
            : "Active";
    }, []);
    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-500"
                    enterFrom="opacity-0"
                    leave="ease-ion duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40"></div>
                </Transition.Child>
            </Dialog>
        </Transition.Root>
    );
};

export default ProfileDrawer;
