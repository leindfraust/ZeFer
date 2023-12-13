import Navigation from "@/components/Navigation";

import { authConfig } from "@/utils/authConfig";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { User } from "@prisma/client";
import QueryWrapper from "@/components/QueryWrapper";
import NextAuthProvider from "@/components/provider/NextAuthProvider";

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
            {children}
            {/* <footer className="footer p-10 bg-base-200 text-base-content">
          <aside>
            <h1 className=' text-7xl'>ZeFer</h1>
            <p>Tell your story to the world.</p>
          </aside>
          <nav>
            <header className="footer-title">Services</header>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav>
          <nav>
            <header className="footer-title">Company</header>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav>
          <nav>
            <header className="footer-title">Legal</header>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </nav>
        </footer> */}
        </>
    );
}
