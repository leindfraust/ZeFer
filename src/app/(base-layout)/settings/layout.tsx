import LinkMenu from "@/components/ui/LinkMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings",
};

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        {
            href: "/settings/profile",
            label: "Profile",
        },
        {
            href: "/settings/preferences",
            label: "Preferences",
        },
        {
            href: "/settings/account",
            label: "Account",
        },
    ];
    return (
        <div className="mt-12 mb-12 lg:mr-28 lg:ml-28 mx-auto">
            <div className="lg:flex justify-center">
                <div className="p-4 mx-auto w-1/2 lg:w-1/6">
                    <LinkMenu links={links} />
                </div>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}
