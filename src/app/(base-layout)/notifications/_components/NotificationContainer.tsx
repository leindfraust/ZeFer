"use client";

import type { Post, UserNotifications } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function NotificationContainer({
    from,
    fromImage,
    message,
    post,
    actionUrl,
}: UserNotifications & {
    post: Post;
}) {
    return (
        <Link href={actionUrl}>
            <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-2">
                            <div className="avatar">
                                <div className="w-12 rounded-full">
                                    {from && fromImage && (
                                        <Image
                                            src={fromImage}
                                            alt={from}
                                            height={45}
                                            width={45}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="container">
                                <p className="text-md font-bold break-words">
                                    {from}
                                </p>
                                <p className="text-sm">
                                    {message}
                                    {post && <strong> {post.title}</strong>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
