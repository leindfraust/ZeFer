import Navigation from "@/components/ui/Navigation";

import { authConfig } from "@/utils/authConfig";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { User } from "@prisma/client";
import QueryWrapper from "@/components/provider/QueryWrapper";
import NextAuthProvider from "@/components/provider/NextAuthProvider";
import { Suspense } from "react";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authConfig);

    const user = (await prisma.user.findUnique({
        where: { id: session?.user.id ?? "" },
        select: {
            name: true,
            image: true,
            id: true,
            username: true,
        },
    })) as User;

    return (
        <>
            <QueryWrapper>
                <NextAuthProvider>
                    <Navigation {...user} />
                </NextAuthProvider>
            </QueryWrapper>
            <Suspense>{children}</Suspense>
        </>
    );
}
