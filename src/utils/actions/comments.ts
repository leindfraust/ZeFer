"use server"

import prisma from "@/db";

export async function getPostComments(titleId: string) {
    const getPost = await prisma.post.findUnique({
        where: { titleId: titleId },
        select: {
            id: true
        }
    })
    if (!getPost) throw new Error("Post not found.")

    const getPostComments = await prisma.postComment.findMany({
        include: {
            postCommentReplies: true
        },
        where: { postId: getPost.id },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (!getPostComments) throw new Error("Comments not found.")
    return getPostComments
}

export async function getPostReplyComments(commentId: string) {
    const getPostReplyComments = await prisma.postComment.findMany({
        where: { id: commentId },
        select: {
            postCommentReplies: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (!getPostReplyComments) throw new Error("Replies not found.")
    return getPostReplyComments[0].postCommentReplies
}

export async function isCommentOwner (userId:string) {
        const commentOwner = await prisma.postComment.findFirst({
            where: {
                userId: userId,
            },
            select:{
                userId:true,
            }
        });
    if(!commentOwner){
        throw new Error("You have no comment for this post yet")
    }
   return commentOwner.userId;
    
}