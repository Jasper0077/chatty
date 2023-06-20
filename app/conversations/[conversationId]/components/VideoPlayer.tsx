"use client";

import React from "react";
import cn from "classnames";
import { User } from "@prisma/client";
import Modal from "@/app/components/modals/Modal";
import useCallStream from "@/app/hooks/useCallStream";
import { pusherServer } from "@/app/libs/pusher";

interface VideoPlayerProps {
    // back: () => void;
    // contact: Partial<User>;
    answerCallId: string | null;
    currentUser: User;
    // isSender: boolean;
    conversationId: string;
    isOpen: boolean;
    onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    answerCallId,
    currentUser,
    conversationId,
    isOpen,
    onClose
}) => {
    const webcamVideo = React.useRef<HTMLVideoElement>(null);
    const remoteVideo = React.useRef<HTMLVideoElement>(null);
    const [answeredStream, setAnsweredStream] =
        React.useState<MediaStream | null>(null);
    const {
        onLocalStreamCreated,
        onRemoteStreamCreated,
        onDisconnect,
        answerCall
    } = useCallStream(conversationId, currentUser, !!answerCallId);

    React.useEffect(() => {
        const unsubscribe = onLocalStreamCreated((localStream) => {
            webcamVideo.current!.srcObject = localStream;
        });

        return () => {
            unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        const unsubscribe = onRemoteStreamCreated((localStream) => {
            setAnsweredStream(localStream);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        const unsubscribe = onDisconnect(() => {
            console.log("disconnect");
            onClose();
        });

        return () => {
            unsubscribe();
        };
    }, [onClose]);

    React.useEffect(() => {
        if (answeredStream && remoteVideo.current) {
            remoteVideo.current.srcObject = answeredStream;
        }
    }, [answeredStream]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
                <video
                    ref={remoteVideo}
                    className="bg-gray-200 rounded-md w-[1080px]"
                    playsInline
                    autoPlay
                />
                <video
                    ref={webcamVideo}
                    className="bg-gray-200 rounded-md w-[1080px]"
                    playsInline
                    autoPlay
                />
            </div>
        </Modal>
    );
};

export default VideoPlayer;
