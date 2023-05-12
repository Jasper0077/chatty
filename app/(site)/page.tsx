import cn from "classnames";
import Image from "next/image";
import { upperCase } from "lodash";
import AuthForm from "@/app/(site)/components/AuthForm";

export default function Home() {
    return (
        <div
            className={cn(
                "flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100"
            )}
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    alt="Logo"
                    height="48"
                    width="48"
                    className="mx-auto w-auto object-contain"
                    src="/images/logo.svg"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    {upperCase("Sign in")}
                </h2>
            </div>
            <AuthForm />
        </div>
    );
}
