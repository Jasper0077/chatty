"use client";

import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiMap, HiPaperAirplane, HiPhoto } from "react-icons/hi2";

import useConversation from "@/app/hooks/useConversation";

import EmojiPicker from "./EmojiPicker";
import MessageInput from "./MessageInput";
import MapModal from "@/app/components/modals/MapModal";

const Form = () => {
    const { conversationId } = useConversation();
    const [showMap, setShowMap] = React.useState<boolean>(false);
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ""
        }
    });
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue("message", "", { shouldValidate: true });
        axios.post("/api/messages", {
            ...data,
            conversationId
        });
    };

    const handleUpload = (result: any) => {
        axios.post("/api/messages", {
            image: result?.info?.secure_url,
            conversationId
        });
    };

    return (
        <>
            <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="gkx3ul9o"
                >
                    <HiPhoto size={30} className="text-sky-500" />
                </CldUploadButton>
                <EmojiPicker
                    setValue={setValue}
                    getValues={() => getValues("message")}
                />
                <HiMap
                    className="text-sky-500"
                    size={30}
                    onClick={() => setShowMap(!showMap)}
                />
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center gap-2 lg:gap-4 w-full"
                >
                    <MessageInput
                        id="message"
                        register={register}
                        errors={errors}
                        required
                        placeholder="Write a message"
                    />
                    <button
                        type="submit"
                        className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
                    >
                        <HiPaperAirplane size={18} className="text-white" />
                    </button>
                </form>
            </div>

            {/* Map Modal */}
            <MapModal
                isOpen={showMap}
                onClose={() => setShowMap(false)}
                view={false}
            />
        </>
    );
};

export default Form;
