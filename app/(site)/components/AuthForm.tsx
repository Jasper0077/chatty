"use client";

import React from "react";
import { upperCase } from "lodash";
import cn from "classnames";
import {
    FieldValue,
    FieldValues,
    RegisterOptions,
    SubmitHandler,
    UseFormRegisterReturn,
    useForm
} from "react-hook-form";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

type Variant = "login" | "register";

const AuthForm = () => {
    const [variant, setVariant] = React.useState<Variant>("register");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const toggleVariant = React.useCallback(() => {
        if (variant === "login") {
            setVariant("register");
        } else {
            setVariant("login");
        }
    }, []);

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

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === "register") {
            // React Query Register
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
                {variant === "register" && (
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Input
                            label="Name"
                            id="name"
                            type="text"
                            register={register}
                            errors={errors}
                        />
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
                        <div>
                            <Button type="submit">
                                {variant === "register" ? "Sign In" : "Login"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
