import { useSession } from "next-auth/react";
import React from "react";
import { User } from "@prisma/client";
import { FullConversation } from "../models";

const useOtherUser = (
    conversation:
        | FullConversation
        | {
              users: User[];
          }
) => {
    const session = useSession();

    const otherUser = React.useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;
        const otherUser = conversation.users.filter(
            (user) => user.email !== currentUserEmail
        );
        return otherUser;
    }, [session?.data?.user?.email, conversation.users]);

    return otherUser;
};

export default useOtherUser;
