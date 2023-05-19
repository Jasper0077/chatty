import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null;
        }
        const currUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });
        if (!currUser) {
            return null;
        }
        return currUser;
    } catch (error: any) {
        return null;
    }
};

export default getCurrentUser;
