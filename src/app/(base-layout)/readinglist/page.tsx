import PostContainer from "@/components/post/PostContainer";
import prisma from "@/db";
import { authConfig } from "@/utils/authConfig";
import { getServerSession } from "next-auth";
import { Fragment } from "react";

export default async function ReadingList() {
    const session = await getServerSession(authConfig);
    const readingList = await prisma.user.findUnique({
        where: { id: session?.user.id },
        select: {
            bookMarks: {
                include: {
                    _count: {
                        select: {
                            reactions: true,
                            comments: true,
                        },
                    },
                    organization: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });

    return (
        <>
            <div className="mt-12 mb-12 ml-4 mr-4 lg:mr-28 lg:ml-28 mx-auto">
                <h1 className="text-2xl font-bold text-info">Reading List</h1>
                <div className="mt-4">
                    {session && readingList?.bookMarks.length !== 0 ? (
                        readingList?.bookMarks.map((post) => (
                            <Fragment key={post.id}>
                                <div className="lg:mr-24 lg:ml-24">
                                    <PostContainer {...post} />
                                </div>
                            </Fragment>
                        ))
                    ) : (
                        <p className="text-md">
                            You do not have any reading lists yet.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
