import { IconType } from "react-icons";

export interface ServiceResponse {
    ok: boolean;
    message: string;
    data: any;
    errors: string | null;
}

export interface Route {
    label: string;
    href: string;
    Icon: IconType;
    onClick?: () => void;
    active: boolean;
}
