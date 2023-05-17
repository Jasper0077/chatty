"use client";

import { Route } from "@/app/models";
import Link from "next/link";
import React from "react";
import cn from "classnames";

interface Props extends Route {}

const DesktopItem: React.FC<Props> = (item: Props) => {
    const handleClick = () => {
        if (item.onClick) {
            return item.onClick();
        }
    };
    return (
        <li onClick={handleClick}>
            <Link
                href={item.href}
                className={cn(
                    "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-400 hover:text-black hover:bg-gray-100",
                    item.active && "bg-gray-100 text-black"
                )}
            >
                <item.Icon className="h-6 w-6 shrink-0" />
                <span className="sr-only">{item.label}</span>
            </Link>
        </li>
    );
};

export default DesktopItem;
