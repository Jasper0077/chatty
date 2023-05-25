"use client";

import { Input } from "postcss";
import { FieldValue, FieldValues, UseFormRegister } from "react-hook-form";

interface Props {
    id: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldValues;
}

const MessageInput: React.FC<Props> = ({
    id,
    placeholder,
    type,
    required,
    register,
    errors
}) => {
    return (
        <div className="relative w-full">
            <input
                id={type}
                type={type}
                autoComplete={id}
                {...register(id, { required })}
                placeholder={placeholder}
                className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
            />
        </div>
    );
};

export default MessageInput;
