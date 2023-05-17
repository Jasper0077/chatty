import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";

interface Props {
    children: React.ReactNode;
}

export default async function UsersLayout({ children }: Props) {
    return (
        // @ts-expect-error Server Component
        <Sidebar>
            <div className="h-full">{children}</div>
        </Sidebar>
    );
}