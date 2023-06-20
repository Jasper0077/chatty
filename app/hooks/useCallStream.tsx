"use client";

import React from "react";
import {
    addAnswerDescription,
    addICEAnswerCandidates,
    addICEOfferCandidates,
    fetchOfferDescription,
    addOfferDescription,
    onAnswerDescription,
    onAnswer,
    onOffer
} from "@/app/services/signal";
import { CallDescription, Contact } from "../models";
import { createObserver } from "../libs/observer";
import { User } from "@prisma/client";
import { pusherClient, pusherServer } from "../libs/pusher";

const ICE_SERVERS = [
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302"
];

interface WebRTCCallbacks {
    onICECandidate: (candidate: RTCIceCandidate) => void;
    onCreateOffer: (offer: RTCSessionDescriptionInit) => void;
    onAnswerCall: (answer: RTCSessionDescriptionInit) => void;
}

const useCallStream = (
    conversationId: string,
    currentUser: Partial<User>,
    isCaller: boolean | null
) => {
    const localStream = React.useRef<MediaStream | null>(null);
    const peerConnection = React.useRef<RTCPeerConnection | null>(null);
    const onLocalStreamCreated = createObserver<MediaStream>();
    const onRemoteStreamCreated = createObserver<MediaStream>();
    const onDisconnect = createObserver<boolean>();

    const offer = React.useCallback(async () => {
        const callId = await createOffer(
            conversationId,
            currentUser,
            peerConnection.current!
        );
        watchAnswer(callId, peerConnection.current!, () => {
            const remoteStream = createRemoteStream(peerConnection.current!);
            onRemoteStreamCreated.publish(remoteStream);
        });
    }, []);

    const answer = React.useCallback((answerCallId: string) => {
        createAnswer(answerCallId, peerConnection.current!);
        watchOffer(answerCallId, peerConnection.current!, () => {
            const remoteStream = createRemoteStream(peerConnection.current!);
            onRemoteStreamCreated.publish(remoteStream);
        });
    }, []);

    const bootstrap = React.useCallback(async () => {
        peerConnection.current = createPeerConnection();
        peerConnection.current.onconnectionstatechange = (event) => {
            switch (peerConnection.current?.connectionState) {
                case "closed":
                case "disconnected":
                case "failed": {
                    onDisconnect.publish(true);
                    break;
                }
                default:
                    break;
            }
        };

        const newLocalStream = await createLocalStream(peerConnection.current);
        localStream.current = newLocalStream;
        onLocalStreamCreated.publish(newLocalStream);

        if (!isCaller) {
            offer();
        }
    }, []);

    const stop = React.useCallback(() => {
        if (localStream.current) {
            stopMediaStream(localStream.current);
        }

        if (peerConnection.current) {
            peerConnection.current.close();
        }
    }, []);

    React.useEffect(() => {
        bootstrap();

        return () => {
            stop();
        };
    }, []);

    return {
        answerCall: answer,
        onLocalStreamCreated: onLocalStreamCreated.subscribe,
        onRemoteStreamCreated: onRemoteStreamCreated.subscribe,
        onDisconnect: onDisconnect.subscribe
    };
};

function createPeerConnection() {
    const servers: RTCConfiguration = {
        iceServers: [
            {
                urls: ICE_SERVERS
            }
        ],
        iceCandidatePoolSize: 10
    };
    return new RTCPeerConnection(servers);
}

async function createLocalStream(peerConnection: RTCPeerConnection) {
    const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    // Push tracks from Local stream to peer connection
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream as MediaStream);
    });

    return localStream;
}

function createRemoteStream(peerConnection: RTCPeerConnection) {
    const remoteStream = new MediaStream();

    // Pull tracks from Remote stream, add to video stream
    peerConnection.addEventListener("track", (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    });

    return remoteStream;
}

function stopMediaStream(mediaStream: MediaStream) {
    mediaStream.getTracks().forEach((track) => {
        track.stop();
    });
}

async function createAnswer(callId: string, peerConnection: RTCPeerConnection) {
    registerICEAnswerCandidates(callId, peerConnection);
    const offer = fetchOfferDescription(callId);
    pusherClient.bind(
        "sdp:offer",
        async (data: { offer: CallDescription; caller: Partial<User> }) => {
            const { offer, caller } = data;
            if (!offer) return;
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.offer)
            );
            const answerDescription = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answerDescription);

            const answer = {
                sdp: answerDescription.sdp,
                type: answerDescription.type
            };

            addAnswerDescription(callId, answer);
        }
    );
}

function watchOffer(
    callId: string,
    peerConnection: RTCPeerConnection,
    callback: () => void
) {
    callback();
    onOffer(callId, (iceCandidateInit) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidateInit));
    });
}

function watchAnswer(
    callId: string,
    peerConnection: RTCPeerConnection,
    callback: () => void
) {
    onAnswerDescription(callId, (description) => {
        callback();
        peerConnection.setRemoteDescription(
            new RTCSessionDescription(description)
        );
    });

    // When answered, add candidate to peer connection
    onAnswer(callId, (iceCandidateInit) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidateInit));
    });
}

async function createOffer(
    conversationId: string,
    caller: Partial<User>,
    peerConnection: RTCPeerConnection
) {
    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type
    };

    pusherServer.trigger(conversationId, "sdp:offer", { offer, caller });
    registerICEOfferCandidates(conversationId, peerConnection);

    return conversationId;
}

function registerICEAnswerCandidates(
    callId: string,
    peerConnection: RTCPeerConnection
) {
    peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
            addICEAnswerCandidates(callId, event.candidate);
        }
    });
}

function registerICEOfferCandidates(
    callId: string,
    peerConnection: RTCPeerConnection
) {
    peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
            addICEOfferCandidates(callId, event.candidate);
        }
    });
}

export default useCallStream;
