"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SearchMenu = () => {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const keyword = searchParams.get("q");

    const links = [
        {
            name: "Posts",
            href: `/search/posts?q=${keyword}`,
            active: pathName === "/search/posts",
        },
        {
            name: "People",
            href: `/search/people?q=${keyword}`,
            active: pathName === "/search/people",
        },
        {
            name: "Tags",
            href: `/search/tags?q=${keyword}`,
            active: pathName === "/search/tags",
        },
        {
            name: "My Posts",
            href: `/search/my-posts?q=${keyword}`,
            active: pathName === "/search/my-posts",
        },
    ];
    return (
        <ul className="menu menu-lg rounded-box">
            {links.map((link, index) => (
                <li key={index}>
                    <Link
                        href={link.href}
                        className={`${link.active ? "active" : ""}`}
                    >
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mt-12 mb-12 lg:mr-28 lg:ml-28 mx-auto">
            <div className="lg:flex justify-center">
                <div className="p-4 mx-auto w-1/2 lg:w-1/6">
                    <Suspense>
                        <SearchMenu />
                    </Suspense>
                </div>
                <div className="flex-1 ml-4 mr-4">{children}</div>
            </div>
        </div>
    );
}
