"use client";

import LinkMenu from "@/components/ui/LinkMenu";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SearchMenu = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("q");

    const links = [
        {
            label: "Posts",
            href: `/search/posts?q=${keyword}`,
        },
        {
            label: "People",
            href: `/search/people?q=${keyword}`,
        },
        {
            label: "Tags",
            href: `/search/tags?q=${keyword}`,
        },
    ];
    return <LinkMenu links={links} relativePathname="/search" />;
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
