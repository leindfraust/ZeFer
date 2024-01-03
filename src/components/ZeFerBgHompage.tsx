"use client";

import zeferCss from "../components/zefer.module.css";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Navigation from "./ui/Navigation";
import Image from "next/image";
import QueryWrapper from "./provider/QueryWrapper";
import NextAuthProvider from "./provider/NextAuthProvider";

export default function ZeFerBgHomepage({
    isLoggedIn,
    user,
}: {
    user: User;
    isLoggedIn: boolean;
}) {
    const [navBackgroundTransparent, setNavBackgroundTransparent] =
        useState<boolean>(true);

    const { ref, inView } = useInView({
        initialInView: true,
    });

    useEffect(() => {
        if (!inView) {
            setNavBackgroundTransparent(false);
        } else {
            setNavBackgroundTransparent(true);
        }
    }, [inView]);

    return (
        <>
            {isLoggedIn ? (
                <QueryWrapper>
                    <NextAuthProvider>
                        <Navigation {...user} />
                    </NextAuthProvider>
                </QueryWrapper>
            ) : (
                <>
                    {!navBackgroundTransparent && (
                        <QueryWrapper>
                            <NextAuthProvider>
                                <Navigation {...user} />
                            </NextAuthProvider>
                        </QueryWrapper>
                    )}
                </>
            )}
            {!isLoggedIn && (
                <div
                    ref={ref}
                    className={`hero min-h-[60vh] ${zeferCss.bgzefergradient}`}
                >
                    <div className="hero-content text-center">
                        {!isLoggedIn && navBackgroundTransparent && (
                            <QueryWrapper>
                                <NextAuthProvider>
                                    <Navigation
                                        {...user}
                                        className="bg-transparent top-0 fixed"
                                    />
                                </NextAuthProvider>
                            </QueryWrapper>
                        )}
                        <div className="max-w-md space-y-4">
                            <Image
                                src={"/zefer-text.svg"}
                                width={500}
                                height={500}
                                alt="zefer logo with text zefer"
                            />
                            <h1 className="text-xl lg:text-3xl text-white">
                                Tell your story to the world.
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
