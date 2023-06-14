"use client";

import React from "react";
import { HiFaceSmile } from "react-icons/hi2";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
    FieldValues,
    UseFormGetValues,
    UseFormSetValue
} from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

interface EmojiPickerProps {
    setValue: UseFormSetValue<FieldValues>;
    getValues: UseFormGetValues<FieldValues>;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ setValue, getValues }) => {
    const [showPicker, setShowPicker] = React.useState<boolean>(false);

    return (
        <>
            <HiFaceSmile
                className="text-sky-500"
                size={30}
                onClick={() => setShowPicker(!showPicker)}
            />
            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="absolute z-10 bottom-20"
                    >
                        <Picker
                            data={data}
                            theme="light"
                            onClickOutside={() => setShowPicker(false)}
                            onEmojiSelect={(emoji: { native: string }) => {
                                const value = getValues();
                                const updatedValue = value + emoji.native;
                                setValue("message", updatedValue, {
                                    shouldValidate: true
                                });
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EmojiPicker;
