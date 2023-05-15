"use client";

import React from "react";
import { QueryClient, dehydrate } from "react-query";
import { ReactQuery } from "./ReactQuery";

export default async function Provider({
    children
}: {
    children: React.ReactNode;
}) {
    const queryClient = new QueryClient();

    const provider = (
        <ReactQuery dehydratedState={dehydrate(queryClient)}>
            {children}
        </ReactQuery>
    );

    queryClient.clear();
    return provider;
}
