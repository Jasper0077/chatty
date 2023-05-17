"use client";

import useRoutes from "@/app/hooks/useRoutes";
import React from "react";
import cn from "classnames";
import DesktopItem from "./DesktopItem";

interface Props {}

const DesktopSidebar = () => {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    return (
        <div
            className={cn(
                "hidden",
                "lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 lg:overflow-y-auto lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between",
                "xl:px-6"
            )}
        >
            <nav className="mt-4 flex flex-col justify-between">
                <ul
                    role="list"
                    className="flex flex-col items-center space-y-1"
                >
                    {routes.map((item) => {
                        return <DesktopItem key={item.label} {...item} />;
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default DesktopSidebar;
