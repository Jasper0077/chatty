"use client";

import { useMutation } from "react-query";
import cn from "classnames";
import { upperCase } from "lodash";
import React from "react";
import {
    FieldValue,
    FieldValues,
    RegisterOptions,
    SubmitHandler,
    useForm,
    UseFormRegisterReturn
} from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";

const AuthForm = () => {
    const registerUser = useMutation({
        mutationFn: (data: FieldValues) => axios.post(`/api/register`, data)
    });
    const [variant, setVariant] = React.useState<"login" | "register">(
        "register"
    );
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const toggleVariant = React.useCallback(() => {
        if (variant === "login") {
            setVariant("register");
        } else {
            setVariant("login");
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
        setIsLoading(true);

        if (variant === "register") {
            event?.preventDefault();
            const response = await registerUser.mutateAsync(data);
            if (response.data) {
                console.log(response.data);
            }
        }

        if (variant === "login") {
            // NextAuth Sign In
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        // Social login
    };
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === "register" && (
                        <Input
                            label="Name"
                            id="name"
                            type="text"
                            register={register}
                            errors={errors}
                        />
                    )}
                    <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        register={register}
                        errors={errors}
                    />
                    <div className="">
                        <Button type="submit" center={true} fullWidth>
                            {variant === "register" ? "Sign In" : "Login"}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="w-full border-t border-gray-600" />
                        <div className="relative flex justify-center text-sm top-[-12px]">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-row gap-2 justify-center items-center">
                        <AuthSocialButton
                            Icon={BsGithub}
                            handler="Github"
                            onClick={() => socialAction("github")}
                        />
                        <AuthSocialButton
                            Icon={BsGoogle}
                            handler="Google"
                            onClick={() => socialAction("google")}
                        />
                    </div>
                    <div className="mt-6 flex flex-row gap-2 justify-center items-center text-sm text-gray-500">
                        <div>
                            {variant === "register"
                                ? "Already have an account?"
                                : "New to Chatty?"}
                        </div>
                        <div
                            onClick={toggleVariant}
                            className="underline cursor-pointer"
                        >
                            {variant === "register"
                                ? "Login"
                                : "Create an account"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
