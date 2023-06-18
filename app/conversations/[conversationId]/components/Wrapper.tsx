"use client";

import React from "react";
import VideoPlayer from "./VideoPlayer";
import { Conversation, User } from "@prisma/client";
import Body from "./Body";
import Form from "./Form";
import Header from "./Header";
import { FullConversation, FullMessage } from "@/app/models";

interface Props {
    conversation: Conversation & {
        users: Array<User>;
    };
    messages: Array<FullMessage>;
}

const ClientWrapper: React.FC<Props> = ({ conversation, messages }) => {
    const [videoPlayer, setVideoPlayer] = React.useState<boolean>(false);
    return (
        <div className="h-full flex flex-col">
            <Header
                conversation={conversation}
                setVideoPlayer={setVideoPlayer}
            />
            <Body initialMessages={messages} />
            <Form />
            {videoPlayer && <VideoPlayer />}
        </div>
    );
};

export default ClientWrapper;
