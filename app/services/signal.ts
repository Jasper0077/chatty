import { User } from "@prisma/client";
import { pusherServer } from "../libs/pusher";
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

export async function addOfferDescription(
    conversationId: string,
    offer: CallDescription,
    caller: Partial<User>
) {
    pusherServer.trigger(conversationId, "sdp:offer", { offer, caller });
}

export async function addAnswerDescription(
    conversationId: string,
    answer: CallDescription
) {
    pusherServer.trigger(conversationId, "sdp:answer", { answer });
}

//   export function onAnswerDescription(
//     callId: string,
//     callback: (description: RTCSessionDescriptionInit) => void
//   ) {
//     const callDoc = firestore.collection("calls").doc(callId);
//     callDoc.onSnapshot((snapshot) => {
//       const data = snapshot.data();

//       if (data?.answer) {
//         callback(data.answer as RTCSessionDescriptionInit);
//       }
//     });
//   }

//   export function onAnswer(
//     callId: string,
//     callback: (iceCandidateInit: RTCIceCandidateInit) => void
//   ) {
//     const answerCandidates = firestore.collection(
//       `calls/${callId}/answerCandidates`
//     );
//     answerCandidates.onSnapshot((snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           callback(change.doc.data() as RTCIceCandidateInit);
//         }
//       });
//     });
//   }

//   export function onOffer(
//     callId: string,
//     callback: (iceCandidateInit: RTCIceCandidateInit) => void
//   ) {
//     const answerCandidates = firestore.collection(
//       `calls/${callId}/offerCandidates`
//     );
//     answerCandidates.onSnapshot((snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           callback(change.doc.data() as RTCIceCandidateInit);
//         }
//       });
//     });
//   }

//   export function onCall(callback: (callId: string, caller: Contact) => void) {
//     const calls = firestore.collection("calls");
//     calls.onSnapshot((snapshot) => {
//       const changes = snapshot.docChanges();

//       if (changes.length === 1) {
//         const change = changes[0];
//         const caller = change.doc.data().caller as Contact;
//         callback(change.doc.id, caller);
//       }
//     });
//   }
