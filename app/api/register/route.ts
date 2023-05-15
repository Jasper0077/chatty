import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { ServiceResponse } from "@/app/models";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        if (!email || !name || !password) {
            return new NextResponse("Invalid Information", { status: 403 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return NextResponse.json(
                <ServiceResponse>{
                    ok: false,
                    message: "User exists",
                    data: null,
                    errors: null
                },
                { status: 400 }
            );
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        return NextResponse.json(
            <ServiceResponse>{
                ok: true,
                message: "User created",
                data: user,
                errors: null
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(error);
    }
}
