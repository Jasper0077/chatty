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
import Input from "@/app/components/inputs/Input";

import AuthSocialButton from "./AuthSocialButton";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ServiceResponse } from "@/app/models";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const { data, error, isError, isLoading, isSuccess, mutate } = useMutation<
        AxiosResponse<ServiceResponse>,
        AxiosError<ServiceResponse>,
        FieldValues
    >({
        mutationFn: (data: FieldValues) =>
            axios.post<ServiceResponse>(`/api/register`, data)
    });
    const [variant, setVariant] = React.useState<"login" | "register">(
        "register"
    );
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (session?.status === "authenticated") {
            router.push("/users");
        }
    }, [session?.status, router]);

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
        if (variant === "register") {
            event?.preventDefault();
            mutate(data);
            if (isError && error.response?.data.message) {
                toast.error(error.response?.data.message);
                return;
            }
            if (isSuccess) {
                toast.success(data.message);
                signIn("credentials", data);
                router.push("/users");
            }
        }

        if (variant === "login") {
            signIn("credentials", {
                ...data,
                redirect: false
            })
                .then((callback) => {
                    console.log("callback", callback);
                    if (callback?.error) {
                        toast.error("Invalid credentials");
                        return;
                    }
                    if (callback?.ok) {
                        toast.success("Logged in!");
                    }
                })
                .finally(() => {
                    // set loading to false
                });
        }
    };

    const socialAction = (action: string) => {
        setLoading(true);

        signIn(action, { redirect: false })
            .then((callback) => {
                console.log("callback", callback);
                if (callback?.error) {
                    toast.error("Invalid credentials");
                }

                if (callback?.ok && !callback?.error) {
                    toast.success("Logged in");
                }
            })
            .finally(() => setLoading(false));
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
                        <Button
                            type="submit"
                            center={true}
                            fullWidth
                            disabled={isLoading}
                        >
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
