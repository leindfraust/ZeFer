"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { User } from "@prisma/client";
import SideMenu from "./menu/SideMenu";
import SearchBar from "./SearchBar";
import { cn } from "@/utils/cn";

type NavigationProps = React.HTMLAttributes<HTMLDivElement>;
export default function Navigation({
    name,
    image,
    id,
    username,
    className,
}: User & NavigationProps) {
    return (
        <>
            <div
                className={cn(
                    "navbar bg-base-200 sticky top-0 z-20",
                    className
                )}
            >
                <div className="flex-none z-20">
                    <div className="drawer">
                        <input
                            id="sidemenu-drawer"
                            type="checkbox"
                            className="drawer-toggle"
                        />
                        <div className="drawer-content">
                            <label
                                htmlFor="sidemenu-drawer"
                                className="lg:hidden btn btn-square btn-ghost"
                            >
                                <FontAwesomeIcon icon={faBars} />
                            </label>
                        </div>
                        <div className="drawer-side">
                            <label
                                htmlFor="sidemenu-drawer"
                                aria-label="close sidebar"
                                className="drawer-overlay !cursor-default"
                            ></label>
                            <div className="p-4 w-80 min-h-full bg-base-200 text-base-content">
                                <SideMenu />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 gap-4">
                    <Link href={"/"} className="normal-case text-xl">
                        <Image
                            src={"/zefer.svg"}
                            height={50}
                            width={50}
                            alt="ZeFer Logo"
                        />
                    </Link>
                    <div className="hidden lg:block">
                        <SearchBar />
                    </div>
                </div>
                {name && image && id ? (
                    <div className="flex-none">
                        <div className="dropdown dropdown-end mr-2">
                            <ThemeSwitcher />
                        </div>
                        <div className="dropdown dropdown-end mr-2">
                            <Link href={"/new"}>
                                <label tabIndex={0} className="btn btn-primary">
                                    Create Post
                                </label>
                            </Link>
                        </div>
                        <div className="dropdown dropdown-end">
                            <label
                                tabIndex={0}
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    <Image
                                        src={image as string}
                                        alt={name as string}
                                        width={50}
                                        height={50}
                                    />
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                            >
                                <li>
                                    <Link
                                        href={`/${username ?? id}`}
                                        className="!block justify-between"
                                    >
                                        <p className="text-lg font-bold">
                                            {name}
                                        </p>
                                        {username && (
                                            <p className="text-slate-400">
                                                @{username}
                                            </p>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/manage"}>Manage Posts</Link>
                                </li>
                                <li>
                                    <Link href={"/readinglist"}>
                                        Reading List
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/settings"}>Settings</Link>
                                </li>
                                <li>
                                    <button
                                        className="text-lg font-semibold"
                                        onClick={() => signOut()}
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex-none">
                        <div className="dropdown dropdown-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => signIn()}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
