"use client";

import type { Post, UserNotifications } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import timeDiff from "@/utils/timeDiffCalc";

export default function NotificationContainer({
    from,
    fromImage,
    message,
    post,
    actionUrl,
    createdAt,
}: UserNotifications & {
    post: Post;
}) {
    return (
        <Link href={actionUrl}>
            <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center flex-1 gap-2">
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
                                <div className="flex items-center">
                                    <div className="container">
                                        <p className="text-md font-bold break-words">
                                            {from}
                                        </p>
                                        <p className="text-sm">
                                            {message}
                                            {post && (
                                                <strong> {post.title}</strong>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="justify-end">
                            <p className="text-xs text-slate-400">
                                {timeDiff(createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
