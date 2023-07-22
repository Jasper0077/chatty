"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import axios from "axios";
import React from "react";
import { HiPaperAirplane } from "react-icons/hi2";
import Map, { GeolocateControl, Marker } from "react-map-gl";
import { useGeolocation } from "react-use";

import useConversation from "@/app/hooks/useConversation";

import Modal from "./Modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    view?: boolean;
    geolocation?: { longitude: number; latitude: number };
}

function MapModal({ isOpen, onClose, geolocation, view = false }: Props) {
    const location = useGeolocation();
    const { conversationId } = useConversation();
    const viewport = React.useMemo(() => {
        if (view && geolocation) {
            return {
                longitude: geolocation.longitude,
                latitude: geolocation.latitude,
                zoom: 15
            };
        }
        return {
            longitude: location.longitude ?? -100,
            latitude: location.latitude ?? 40,
            zoom: 15
        };
    }, [location.longitude, location.latitude]);

    const onSubmit: () => void = () => {
        console.log("debug viewport", {
            geolocation: {
                latitude: viewport.latitude,
                longitude: viewport.longitude
            },
            conversationId
        });

        axios.post("/api/messages", {
            geolocation: {
                latitude: viewport.latitude,
                longitude: viewport.longitude
            },
            conversationId
        });
    };

    // React.useEffect(() => {
    //     console.log("debug", viewport);
    // }, [viewport]);
    if (view && !geolocation) {
        return null;
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form
                onSubmit={onSubmit}
                className="h-max w-max flex flex-col items-start justify-center space-y-4"
            >
                {!view && (
                    <h4 className="text-lg uppercase font-semibold">
                        Share Your Current Location
                    </h4>
                )}
                <Map
                    style={{ width: 800, height: 600 }}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    initialViewState={viewport}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <GeolocateControl
                        positionOptions={{ enableHighAccuracy: true }}
                        trackUserLocation={true}
                    />
                    <Marker
                        longitude={viewport.longitude}
                        latitude={viewport.latitude}
                    />
                </Map>
                {!view && (
                    <button
                        type="button"
                        className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition ml-auto"
                        onClick={onSubmit}
                    >
                        <HiPaperAirplane size={18} className="text-white" />
                    </button>
                )}
            </form>
        </Modal>
    );
}

export default MapModal;
