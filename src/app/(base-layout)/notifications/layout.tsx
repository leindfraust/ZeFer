import { Metadata } from "next";
import LinkMenu from "@/components/ui/LinkMenu";

export const metadata: Metadata = {
    title: "Notifications - ZeFer",
};

export default async function ManageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        {
            href: "/notifications",
            label: "All",
        },
        {
            href: "/notifications/reactions",
            label: "Reactions",
        },
        {
            href: "/notifications/comments",
            label: "Comments",
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
