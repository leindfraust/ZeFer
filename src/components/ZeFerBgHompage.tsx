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
                    className={`hero min-h-[70vh] ${zeferCss.bgzefergradient}`}
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
                        <div className="max-w-fit space-y-4">
                            <Image
                                src={"/zefer-text.svg"}
                                width={500}
                                height={500}
                                alt="zefer logo with text zefer"
                                style={{ display: "block", margin: "0 auto" }}
                            />
                            <h1 className=" text text-white text-xl lg:text-3xl">
                                Craft and tell your holiday stories, poems and
                                articles to the world.
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
