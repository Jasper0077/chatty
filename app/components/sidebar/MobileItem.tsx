import { Route } from "@/app/models";
import Link from "next/link";
import React from "react";
import cn from "classnames";

interface Props extends Route {}

const MobileItem = (item: Props) => {
    const handleClick = () => {
        if (item.onClick) {
            return item.onClick();
        }
    };
    return (
        <Link
            href={item.href}
            onClick={handleClick}
            className={cn(
                "group flex gap-x-3 text-sm leading-6 font-semibold w-full justiy-center p-4 text-gray-500 hover:text-black hover:bg-gray-100",
                item.active && "bg-gray-100 text-black"
            )}
        >
            <item.Icon className="h6 w-6 mx-auto" />
        </Link>
    );
};

export default MobileItem;
