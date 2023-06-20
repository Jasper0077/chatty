import { User } from "@prisma/client";
import { pusherClient, pusherServer } from "../libs/pusher";
import { CallDescription } from "../models";

export function addICEOfferCandidates(
    conversationId: string,
    candidate: RTCIceCandidate
) {
    pusherServer.trigger(conversationId, "ice:offer", candidate.toJSON());
}

export function addICEAnswerCandidates(
    conversationId: string,
    candidate: RTCIceCandidate
) {
    pusherServer.trigger(conversationId, "ice:anwser", candidate.toJSON());
}

export function addOfferDescription(
    conversationId: string,
    offer: CallDescription,
    caller: Partial<User>
) {
    pusherServer.trigger(conversationId, "sdp:offer", { offer, caller });
}

export function fetchOfferDescription(callId: string) {
    let offer: CallDescription | null = null;
    pusherClient.bind(
        "sdp:offer",
        (data: { offer: CallDescription; caller: Partial<User> }) => {
            if (data.offer) {
                return data.offer;
            }
        }
    );
}

export function addAnswerDescription(
    conversationId: string,
    answer: CallDescription
) {
    pusherServer.trigger(conversationId, "sdp:answer", { answer });
}

export function onAnswerDescription(
    callId: string,
    callback: (description: RTCSessionDescriptionInit) => void
) {
    pusherClient.subscribe(callId);
    pusherClient.bind("sdp:answer", (data: { answer: CallDescription }) => {
        if (data?.answer) {
            callback(data.answer as RTCSessionDescriptionInit);
        }
    });
}

export function onAnswer(
    callId: string,
    callback: (iceCandidateInit: RTCIceCandidateInit) => void
) {
    pusherClient.subscribe(callId);
    pusherClient.bind("ice:answer", (data: RTCIceCandidateInit) => {
        if (data) {
            callback(data);
        }
    });
}

export function onOffer(
    callId: string,
    callback: (iceCandidateInit: RTCIceCandidateInit) => void
) {
    pusherClient.subscribe(callId);
    pusherClient.bind("ice:offer", (data: RTCIceCandidateInit) => {
        if (data) {
            callback(data);
        }
    });
}

export function onCall(
    callback: (callId: string, caller: Partial<User>) => void
) {
    console.log("callback");
    // const calls = firestore.collection("calls");
    // calls.onSnapshot((snapshot) => {
    //   const changes = snapshot.docChanges();
    //   if (changes.length === 1) {
    //     const change = changes[0];
    //     const caller = change.doc.data().caller as Contact;
    //     callback(change.doc.id, caller);
    //   }
    // });
}
