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

    const otherUsers = React.useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;
        const otherUsrs = conversation.users.filter(
            (user) => user.email !== currentUserEmail
        );
        return otherUsrs;
    }, [session?.data?.user?.email, conversation.users]);

    return otherUsers[0];
};

export default useOtherUser;
