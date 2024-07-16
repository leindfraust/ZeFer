import LinkMenu from "@/components/ui/LinkMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage",
};

export default async function ManageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        {
            href: "/manage/posts",
            label: "Posts",
        },
        {
            href: "/manage/series",
            label: "Series",
        },
        {
            href: "/manage/following",
            label: "Following",
        },
        {
            href: "/manage/organization",
            label: "Organization",
        },
    ];
    return (
        <div className="mt-12 mb-12 lg:mr-28 lg:ml-28 mx-auto">
            <div className="lg:flex justify-center">
                <div className="p-4 mx-auto w-1/2 lg:w-1/6">
                    <LinkMenu links={links} />
                </div>
                <div className="flex-1 ml-4 mr-4">{children}</div>
            </div>
        </div>
    );
}
