import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import getUsers from "@/app/actions/getUsers";
import UserList from "./components/UserList";

interface Props {
    children: React.ReactNode;
}

export default async function UsersLayout({ children }: Props) {
    const users = await getUsers();
    return (
        // @ts-expect-error Server Component
        <Sidebar>
            <div className="h-full">
                <UserList users={users} />
                {children}
            </div>
        </Sidebar>
    );
}
