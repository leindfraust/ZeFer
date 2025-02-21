import PostList from "@/components/post/PostList";
import QueryWrapper from "@/components/provider/QueryWrapper";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import { User } from "@prisma/client";
import SideMenu from "@/components/menu/SideMenu";
import TagRankingMenu from "@/components/menu/TagRankingMenu";
import ZeFerBgHomepage from "@/components/ZeFerBgHompage";
import { Suspense } from "react";

export default async function Home() {
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
            <ZeFerBgHomepage user={user} />
            <div className="mx-auto mt-12 mb-12 lg:mr-28 lg:ml-28">
                <div className="flex justify-center">
                    <div className="hidden lg:block w-1/4">
                        <SideMenu />
                    </div>

                    <div className="w-full ml-4 mr-4">
                        <QueryWrapper>
                            <Suspense>
                                <PostList />
                            </Suspense>
                        </QueryWrapper>
                    </div>

                    <div className="hidden lg:block w-1/4">
                        <TagRankingMenu />
                    </div>
                </div>
            </div>
        </>
    );
}
