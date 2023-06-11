"use client";

import Modal from "@/app/components/modals/Modal";
import Image from "next/image";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    src: string;
}

const ImageModal: React.FC<Props> = ({ isOpen, onClose, src }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex items-center justify-center">
                <Image
                    alt="Image"
                    height="400"
                    width="400"
                    src={src}
                    className="object-cover"
                />
            </div>
        </Modal>
    );
};

export default ImageModal;
