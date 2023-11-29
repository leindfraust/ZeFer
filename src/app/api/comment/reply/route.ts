import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const commentId = url.searchParams.get("commentId")

    const getPostReplyComments = await prisma.postComment.findMany({
        where: { id: commentId as string },
        select: {
            postCommentReplies: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (getPostReplyComments) return NextResponse.json({ data: getPostReplyComments[0].postCommentReplies }, { status: 200 })
}