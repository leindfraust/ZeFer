import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const titleId = url.searchParams.get("titleId")

    const getPost = await prisma.post.findUnique({
        where: { titleId: titleId as string },
        select: {
            id: true
        }
    })
    if (!getPost) throw new Error("Post not found.")

    const getPostComments = await prisma.postComment.findMany({
        include: {
            postCommentReplies: true,
            reactions: true
        },
        where: { postId: getPost.id },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (!getPostComments) throw new Error("Comments not found.")
    return NextResponse.json({ data: getPostComments }, { status: 200 })
}