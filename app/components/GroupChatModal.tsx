import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "./modals/Modal";
import Input from "./inputs/Input";
import Select from "./inputs/Select";
import Button from "./Button";

interface Props {
    users: User[];
    isOpen: boolean;
    onClose: () => void;
}

const GroupChatModal: React.FC<Props> = ({ users, isOpen, onClose }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            members: []
        }
    });

    const members = watch("members");
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios
            .post("/api/conversations", {
                ...data,
                isGroup: true
            })
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch((error: any) => {
                toast.error("Something went wrong");
                console.log("debug", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Create Group Chat
                        </h2>
                        <p className="mt-1 text-sm leading-6 tedxt-gray-600">
                            Create a chat with more than 2 people.
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                register={register}
                                label="Name"
                                id="name"
                                disabled={isLoading}
                                required
                                errors={errors}
                            />
                            <Select
                                disabled={isLoading}
                                label="members"
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name
                                }))}
                                value={members}
                                onChange={(value: Record<string, any>) =>
                                    setValue("members", value, {
                                        shouldValidate: true
                                    })
                                }
                            />
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <Button
                                disabled
                                onClick={onClose}
                                type="button"
                                secondary
                            >
                                Cancel
                            </Button>
                            <Button disabled onClick={onClose} type="submit">
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default GroupChatModal;
