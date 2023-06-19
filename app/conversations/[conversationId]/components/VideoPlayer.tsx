"use client";

import React from "react";
import cn from "classnames";
import { User } from "@prisma/client";
import Modal from "@/app/components/modals/Modal";
import useCallStream from "@/app/hooks/useCallStream";

interface VideoPlayerProps {
    // back: () => void;
    // contact: Partial<User>;
    // answerCallId: string | null;
    // currentUser: User;
    // isSender: boolean;
    conversationId: string;
    isOpen: boolean;
    onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    conversationId,
    isOpen,
    onClose
}) => {
    const [peerConnection, setPeerConnection] =
        React.useState<RTCPeerConnection | null>(null);
    const localVideoRef = React.useRef<HTMLVideoElement>(null);
    const remoteVideoRef = React.useRef<HTMLVideoElement>(null);

    const handleICECandidate = (candidate: RTCIceCandidate) => {
        // Handle ICE candidate
    };

    const handleCreateOffer = (offer: RTCSessionDescriptionInit) => {
        // Handle offer creation
    };

    const handleAnswerCall = (answer: RTCSessionDescriptionInit) => {
        // Set the remote description
        peerConnection
            ?.setRemoteDescription(answer)
            .then(() => {
                console.log("Remote description set successfully.");

                // Start receiving remote stream
                if (
                    remoteVideoRef.current &&
                    remoteVideoRef.current.srcObject === null
                ) {
                    // const remoteStream = peerConnection!.getRemoteStreams()[0];
                    // if (remoteStream) {
                    //     remoteVideoRef.current.srcObject = remoteStream;
                    // }
                }
            })
            .catch((error) => {
                console.error("Error setting remote description:", error);
            });
    };

    const { createPeerConnection, createOffer, answerCall } = useCallStream(
        conversationId,
        {
            onICECandidate: handleICECandidate,
            onCreateOffer: handleCreateOffer,
            onAnswerCall: handleAnswerCall
        }
    );

    React.useEffect(() => {
        createPeerConnection();
    }, [createPeerConnection]);

    React.useEffect(() => {}, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
                <video
                    className="bg-gray-200 rounded-md w-[1080px]"
                    playsInline
                    autoPlay
                />
                <video
                    ref={localVideoRef}
                    className="bg-gray-200 rounded-md w-[1080px]"
                    playsInline
                    autoPlay
                />
            </div>
        </Modal>
    );
};

export default VideoPlayer;
