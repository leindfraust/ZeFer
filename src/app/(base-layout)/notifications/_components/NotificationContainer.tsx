"use client";

import { UserNotifications } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function NotificationContainer({
    from,
    fromImage,
    message,
    actionUrl,
}: UserNotifications) {
    return (
        <Link href={actionUrl}>
            <div className="container rounded-box">
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2">
                        <div className="avatar">
                            <div className=" rounded-full">
                                {from && fromImage && (
                                    <Image
                                        src={fromImage}
                                        alt={from}
                                        height={50}
                                        width={50}
                                    />
                                )}
                            </div>
                        </div>
                        <p className="text-lg font-bold">{from}</p>
                    </div>
                    <p className="text-md">{message}</p>
                </div>
            </div>
        </Link>
    );
}
