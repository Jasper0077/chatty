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
            <div className="w-80 h-80">
                <Image
                    alt="Image"
                    height="288"
                    width="288"
                    src={src}
                    className="object-cover"
                />
            </div>
        </Modal>
    );
};

export default ImageModal;
