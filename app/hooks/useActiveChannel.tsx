import React from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
    const { set, add, remove } = useActiveList();
    const [activeChannel, setActiveChannel] = React.useState<Channel | null>(
        null
    );

    React.useEffect(() => {
        let channel = activeChannel;

        if (!channel) {
            channel = pusherClient.subscribe("presence-chatty");
            setActiveChannel(channel);
        }

        channel.bind("pusher:subcription_succeeded", (members: Members) => {
            const initialMembers: string[] = [];
            members.each((member: Record<string, any>) =>
                initialMembers.push(member.id)
            );
        });
        channel.bind("pusher:member_added", (member: Record<string, any>) => {
            add(member.id);
        });
        channel.bind("pusher:member_removed", (member: Record<string, any>) => {
            remove(member.id);
        });

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe("presence-chatty");
                setActiveChannel(null);
            }
        };
    }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
