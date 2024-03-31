"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MenuLink } from "@/types/menu";

export default function LinkMenu({ links }: { links: MenuLink[] }) {
    const router = useRouter();
    const pathName = usePathname();
    const [selectedLink, setSelectedLink] = useState<string>(pathName);

    function selectLink(e: React.ChangeEvent<HTMLSelectElement>) {
        const splitLink = e.currentTarget.value.split("?")[0];
        if (pathName !== splitLink) {
            setSelectedLink(e.currentTarget.value);
            router.push(e.currentTarget.value);
        }
    }

    function activeLink(href: string) {
        const splitLink = href.split("?")[0];
        if (pathName === splitLink) return "active";
    }

    return (
        <>
            <ul className="hidden lg:block menu menu-lg rounded-box">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            onClick={() => setSelectedLink(link.href)}
                            className={activeLink(link.href)}
                        >
                            {link.label}
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
                    <option key={link.label} value={link.href}>
                        {link.label}
                    </option>
                ))}
            </select>
        </>
    );
}
