"use client";

import React from "react";
import {
    addAnswerDescription,
    addICEAnswerCandidates,
    addICEOfferCandidates,
    addOfferDescription
} from "@/app/services/signal";
import { CallDescription, Contact } from "../models";
import { createObserver } from "../libs/observer";
import { User } from "@prisma/client";
import { pusherClient, pusherServer } from "../libs/pusher";

const ICE_SERVERS = [
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302"
];

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

interface WebRTCCallbacks {
    onICECandidate: (candidate: RTCIceCandidate) => void;
    onCreateOffer: (offer: RTCSessionDescriptionInit) => void;
    onAnswerCall: (answer: RTCSessionDescriptionInit) => void;
}

const useWebRTC = (
    channelName: string,
    { onICECandidate, onCreateOffer, onAnswerCall }: WebRTCCallbacks
) => {
    useEffect(() => {
        // peer-to-peer use conversationId
        pusherClient.subscribe(channelName);

        pusherClient.bind("ice-candidate", (candidate: any) => {
            const iceCandidate = new RTCIceCandidate(candidate);
            onICECandidate(iceCandidate);
        });

        pusherClient.bind("offer", (offer: RTCSessionDescriptionInit) => {
            onCreateOffer(offer);
        });

        pusherClient.bind("answer", (answer: RTCSessionDescriptionInit) => {
            onAnswerCall(answer);
        });

        return () => {
            pusherClient.unsubscribe(channelName);
        };
    }, [channelName, onICECandidate, onCreateOffer, onAnswerCall]);

    const createPeerConnection = () => {
        const config = {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" }
            ]
        };

        const pc = new RTCPeerConnection(config);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidateData = event.candidate.toJSON();
                pusherServer.trigger(
                    channelName,
                    "ice-candidate",
                    candidateData
                );
            }
        };

        return pc;
    };

    const createOffer = async (peerConnection: RTCPeerConnection) => {
        if (!peerConnection) return;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        pusherServer.trigger(channelName, "offer", offer);
    };

    const answerCall = async (
        offer: RTCSessionDescriptionInit,
        peerConnection: RTCPeerConnection
    ) => {
        if (!peerConnection) return;

        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        pusherServer.trigger(channelName, "answer", answer);
    };

    return {
        createPeerConnection,
        createOffer,
        answerCall
    };
};

export default useWebRTC;
