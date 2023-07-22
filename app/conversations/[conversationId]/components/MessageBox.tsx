"use client";

import { FullMessage } from "@/app/models";
import { useSession } from "next-auth/react";
import React from "react";
import cn from "classnames";
import Avatar from "@/app/components/Avatar";
import { format } from "date-fns";
import Image from "next/image";
import ImageModal from "./ImageModal";
import MapModal from "@/app/components/modals/MapModal";
import Map, { GeolocateControl, Marker } from "react-map-gl";

interface Props {
    isLast?: boolean;
    data: FullMessage;
}

const MessageBox: React.FC<Props> = ({ isLast, data }: Props) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = React.useState<boolean>(false);
    const [mapModalOpen, setMapModalOpen] = React.useState<boolean>(false);

    const isOwn = session?.data?.user?.email === data.sender.email;
    const seenUsernames = (data.seen || [])
        .filter((user) => user.email !== data.sender.email)
        .map((user) => user.name)
        .join(", ");
    const container = cn("flex gap-3 p-4", isOwn && "justify-end");

    const avatar = cn(isOwn && "order-2");
    const body = cn("flex flex-col gap-2", isOwn && "items-end");
    const message = cn(
        "text-sm w-fit overflow-hidden",
        isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
        data.image && "rounded-md p-0",
        data.geolocation ? "rounded-none p-0" : "rounded-full py-2 px-3"
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex flex-row gap-1 items-baseline">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-[8px] text-gray-400">
                        {format(new Date(data.createdAt), "p")}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className={message}>
                        {data.image && (
                            <ImageModal
                                src={data.image}
                                isOpen={imageModalOpen}
                                onClose={() => setImageModalOpen(false)}
                            />
                        )}
                        {data.geolocation && (
                            <MapModal
                                isOpen={mapModalOpen}
                                onClose={() => setMapModalOpen(false)}
                                view={true}
                                geolocation={
                                    data.geolocation as {
                                        latitude: number;
                                        longitude: number;
                                    }
                                }
                            />
                        )}
                        {data.image ? (
                            <Image
                                alt="Image"
                                height="288"
                                width="288"
                                src={data.image}
                                className="object-cover cursor-pointer hover:scale-110 transition translate"
                                onClick={() => setImageModalOpen(true)}
                            />
                        ) : data.geolocation ? (
                            <div
                                data-tooltip-target="tooltip-default"
                                className="hover:bg-gray-600 hover:cursor-pointer bg-opacity-60 group"
                                onClick={() => setMapModalOpen(true)}
                            >
                                <Map
                                    style={{ width: 240, height: 200 }}
                                    interactive={false}
                                    mapboxAccessToken={
                                        process.env.NEXT_PUBLIC_MAPBOX_TOKEN
                                    }
                                    initialViewState={{
                                        longitude: (
                                            data.geolocation as {
                                                longitude: number;
                                                latitude: number;
                                            }
                                        ).longitude,
                                        latitude: (
                                            data.geolocation as {
                                                longitude: number;
                                                latitude: number;
                                            }
                                        ).latitude,
                                        zoom: 15
                                    }}
                                    mapStyle="mapbox://styles/mapbox/streets-v11"
                                >
                                    <GeolocateControl
                                        positionOptions={{
                                            enableHighAccuracy: true
                                        }}
                                        trackUserLocation={true}
                                    />
                                    <Marker
                                        longitude={
                                            (
                                                data.geolocation as {
                                                    longitude: number;
                                                    latitude: number;
                                                }
                                            ).longitude
                                        }
                                        latitude={
                                            (
                                                data.geolocation as {
                                                    longitude: number;
                                                    latitude: number;
                                                }
                                            ).latitude
                                        }
                                    />
                                </Map>
                            </div>
                        ) : (
                            <>
                                {data.body && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: data.body
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                    {isLast && isOwn && seenUsernames.length > 0 && (
                        <div className="text-xs font-light text-gray-500">
                            Seen
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBox;
