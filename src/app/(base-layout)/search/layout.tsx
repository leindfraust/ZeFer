import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const keyword = searchParams.get("q");
    return (
        <div className="mt-12 mb-12 lg:mr-28 lg:ml-28 mx-auto">
            <div className="lg:flex justify-center">
                <div className="p-4 mx-auto w-1/2 lg:w-1/6">
                    <ul className="menu menu-lg rounded-box">
                        <li>
                            <Link
                                href={`/search/posts?q=${keyword}`}
                                className={`${
                                    pathName === "/search/posts" ? "active" : ""
                                }`}
                            >
                                Posts
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/search/people?q=${keyword}`}
                                className={`${
                                    pathName === "/search/people"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                People
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/search/tags?q=${keyword}`}
                                className={`${
                                    pathName === "/search/tags" ? "active" : ""
                                }`}
                            >
                                Tags
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/search/my-posts?q=${keyword}`}
                                className={`${
                                    pathName === "/search/my-posts"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                My Posts
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 ml-4 mr-4">{children}</div>
            </div>
        </div>
    );
}
