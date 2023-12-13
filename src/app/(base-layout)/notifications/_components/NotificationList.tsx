"use client";

import useSocket from "@/socket";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import NotificationContainer from "./NotificationContainer";
import { UserNotifications } from "@prisma/client";

export default function NotificationList() {
    const socket = useSocket();
    const getNotifications = async () => {
        const response = await fetch("/api/notification");
        const json = await response.json();
        const data = await json;
        return await data.data;
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
                data.map((notification: UserNotifications) => (
                    <Fragment key={notification.id}>
                        <div className="space-y-4">
                            <NotificationContainer {...notification} />
                        </div>
                    </Fragment>
                ))}

            {data?.length === 0 && (
                <p className="text-xl">No notifications for now.</p>
            )}
        </div>
    );
}
