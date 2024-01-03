"use client";

import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManageLinks() {
    const router = useRouter();
    const pathName = usePathname();
    const extractedPath = pathName.substring(pathName.lastIndexOf("/") + 1);
    const [selectedLink, setSelectedLink] = useState<string>(extractedPath);

    function selectLink(e: React.ChangeEvent<HTMLSelectElement>) {
        if (extractedPath !== e.currentTarget.value)
            router.push(`/manage/${e.currentTarget.value}`);
    }

    useEffect(() => {
        if (extractedPath) setSelectedLink(extractedPath);
    }, [extractedPath]);

    function activeLink(link: string) {
        if (extractedPath === link) return "active";
    }

    const links = ["posts", "series", "following", "organization"];

    return (
        <>
            <ul className="hidden lg:block menu menu-lg rounded-box">
                {links.map((link) => (
                    <li key={link}>
                        <Link
                            href={`/manage/${link}`}
                            className={activeLink(link)}
                        >
                            {capitalizeFirstLetter(link)}
                        </Link>
                    </li>
                ))}
            </ul>
            <select
                className="select select-bordered font-bold text-lg w-full max-w-xs lg:hidden"
                value={selectedLink}
                onChange={selectLink}
            >
                {links.map((link) => (
                    <option key={link} value={link}>
                        {capitalizeFirstLetter(link)}
                    </option>
                ))}
            </select>
        </>
    );
}
