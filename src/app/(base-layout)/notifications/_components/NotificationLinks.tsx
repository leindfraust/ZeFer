"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotificationLinks() {
    const router = useRouter();
    const pathName = usePathname();
    const extractedPath = pathName.substring(pathName.lastIndexOf("/") + 1);
    const [selectedLink, setSelectedLink] = useState<string>(extractedPath);

    function selectLink(e: React.ChangeEvent<HTMLSelectElement>) {
        if (extractedPath !== e.currentTarget.value)
            router.push(`/notifications/${e.currentTarget.value}`);
    }

    useEffect(() => {
        if (extractedPath) setSelectedLink(extractedPath);
    }, [extractedPath]);

    function activeLink(link: string) {
        if (extractedPath === link) return "active";
    }

    return (
        <>
            <ul className="hidden lg:block menu menu-lg rounded-box">
                <li>
                    <Link href={"/notifications"} className={activeLink("all")}>
                        All
                    </Link>
                </li>
                <li>
                    <Link
                        href={"/notifications/comments"}
                        className={activeLink("comments")}
                    >
                        Comments
                    </Link>
                </li>
                <li>
                    <Link
                        href={"/notifications/posts"}
                        className={activeLink("posts")}
                    >
                        Posts
                    </Link>
                </li>
            </ul>
            <select
                className="select select-bordered font-bold text-lg w-full max-w-xs lg:hidden"
                value={selectedLink}
                onChange={selectLink}
            >
                <option value="all">All</option>
                <option value="comments">Comments</option>
                <option value="posts">Posts</option>
            </select>
        </>
    );
}
