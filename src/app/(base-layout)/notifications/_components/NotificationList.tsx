"use client";

import useSocket from "@/socket";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import NotificationContainer from "./NotificationContainer";
import { Post, UserNotifications } from "@prisma/client";
import { usePathname } from "next/navigation";

export default function NotificationList() {
    const socket = useSocket();
    const pathName = usePathname();
    const slug =
        pathName.split("/").length === 3
            ? pathName.split("/").pop()
            : undefined;
    const getNotifications = async () => {
        const params = new URLSearchParams({
            ...(slug && {
                q: slug === "reactions" ? "reacted" : "commented | replied",
            }),
        });
        const response = await fetch(`/api/notification?${params}`);
        const data = await response.json();
        return data.data;
    };

    const { data, refetch } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    useEffect(() => {
        socket.on("notifications", () => {
            refetch();
        });

        return () => {
            socket.off("notifications");
        };
    }, [refetch, socket]);

    return (
        <div className="space-y-4">
            {data &&
                data.length !== 0 &&
                data.map((notification: UserNotifications & { post: Post }) => (
                    <Fragment key={notification.id}>
                        <div className="space-y-4">
                            <NotificationContainer
                                {...notification}
                                post={notification.post}
                            />
                        </div>
                    </Fragment>
                ))}

            {data?.length === 0 && (
                <p className="text-xl">No notifications for now.</p>
            )}
        </div>
    );
}
