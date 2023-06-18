"use client";

import React from "react";
import cn from "classnames";
import { User } from "@prisma/client";

interface VideoPlayerProps {
    // back: () => void;
    // contact: Partial<User>;
    // answerCallId: string | null;
    // currentUser: User;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({}) => {
    return (
        <div
            className={cn(
                "z-40 fixed w-full h-[100vh] top-[74px] bg-gray-400 p-4",
                "flex flex-col items-center justify-center gap-2"
            )}
        >
            <div className="flex items-center justify-center w-[600px]">
                <video
                    className="bg-white rounded-md w-full"
                    playsInline
                    autoPlay
                />
            </div>
            <div className="flex items-center justify-center w-[600px]">
                <video
                    className="bg-white rounded-md w-full"
                    playsInline
                    autoPlay
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
