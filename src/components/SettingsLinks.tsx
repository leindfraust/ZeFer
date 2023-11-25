"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsLinks() {
    const router = useRouter();
    const pathName = usePathname();
    const extractedPath = pathName.substring(pathName.lastIndexOf("/") + 1);
    const [selectedLink, setSelectedLink] = useState<string>(extractedPath);

    function selectLink(e: React.ChangeEvent<HTMLSelectElement>) {
        if (extractedPath !== e.currentTarget.value)
            router.push(`/settings/${e.currentTarget.value}`);
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
                    <Link
                        href={"/settings/profile"}
                        className={activeLink("profile")}
                    >
                        Profile
                    </Link>
                </li>
                <li>
                    <Link
                        href={"/settings/preferences"}
                        className={activeLink("preferences")}
                    >
                        Preferences
                    </Link>
                </li>
                <li>
                    <Link
                        href={"/settings/account"}
                        className={activeLink("account")}
                    >
                        Account
                    </Link>
                </li>
            </ul>
            <select
                className="select select-bordered font-bold text-lg w-full max-w-xs lg:hidden"
                value={selectedLink}
                onChange={selectLink}
            >
                <option value="profile">Profile</option>
                <option value="preferences">Preferences</option>
                <option value="account">Account</option>
            </select>
        </>
    );
}
