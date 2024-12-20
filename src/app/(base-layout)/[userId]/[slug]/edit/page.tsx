import prisma from "@/db";
// import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import Tiptap from "@/components/wysiwyg/Tiptap";
import { JSONContent } from "@tiptap/react";

// export async function generateMetadata({
//     params,
// }: {
//     params: { userId: string; slug: string };
// }): Promise<Metadata> {
//     const { userId, slug } = params;
//     const post = await prisma.post.findFirst({
//         where: {
//             OR: [
//                 {
//                     userId: userId,
//                     titleId: slug,
//                 },
//                 {
//                     authorUsername: userId,
//                     titleId: slug,
//                 },
//             ],
//         },
//     });
//     return {
//         title: `Edit Post: ${post?.title}`,
//         description: post?.description,
//         openGraph: { images: [post?.coverImage as string] },
//         authors: [{ name: post?.author }],
//     };
// }

export default async function EditPost({
    params,
}: {
    params: Promise<{ userId: string; slug: string }>;
}) {
    const { slug, userId } = await params;
    const post = await prisma.post.findFirst({
        where: {
            titleId: slug,
            OR: [
                {
                    userId: userId,
                },
                {
                    authorUsername: userId,
                },
            ],
        },
    });
    if (!post) return notFound();

    const session = await getServerSession(authConfig);
    const user = await prisma.user.findUnique({
        where: { id: session?.user.id },
        select: {
            id: true,
            username: true,
        },
    });

    const isLoggedIn = (await session?.user.id) === post.userId;

    if (!isLoggedIn) return notFound();

    const tags = await import("../../../../api/tag/route");

    const postContent = {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content as JSONContent,
        tags: post.tags,
        coverImage: post.coverImage as string,
        userId: post.userId,
    };

    return (
        <Tiptap
            userId={user?.id}
            username={user?.username}
            editOrDraft={postContent}
            mode={"edit"}
            tags={[...(await (await tags.GET()).json())]}
        />
    );
}
