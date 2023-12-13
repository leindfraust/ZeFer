"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";

export function TopLoader() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
        if (NProgress.status || NProgress.status === null) {
            NProgress.done();
            NProgress.remove();
        }
    }, [pathname, router, searchParams]);
    return null;
}
