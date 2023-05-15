import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

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
            return new NextResponse("User exists", { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        });

        return NextResponse.json({
            status: 201,
            message: "User created",
            data: user,
            errors: null
        });
    } catch (error: any) {
        console.error(error);
    }
}
