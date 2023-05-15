import { User } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { ServiceResponse } from "../models";

interface Credential {
    email: string;
    name: string;
    password: string;
}

export async function postUser(data: Credential): Promise<any> {
    const response = await axios.post<ServiceResponse>("/api/register", data);
    if (response.data) {
        const { status, message, data, errors } = response.data;
        console.log(status, message);
    }
}
