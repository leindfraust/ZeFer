"use server";
import prisma from "@/db";
import { NextRequest } from "next/server";
export async function getPostComments(titleId: string) {
    const getPost = await prisma.post.findUnique({
        where: { titleId: titleId },
        select: {
            id: true,
        },
    });
    if (!getPost) throw new Error("Post not found.");

    const getPostComments = await prisma.postComment.findMany({
        include: {
            postCommentReplies: true,
        },
        where: { postId: getPost.id },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!getPostComments) throw new Error("Comments not found.");
    return getPostComments;
}

export async function getPostReplyComments(commentId: string) {
    const getPostReplyComments = await prisma.postComment.findMany({
        where: { id: commentId },
        select: {
            postCommentReplies: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!getPostReplyComments) throw new Error("Replies not found.");
    return getPostReplyComments[0].postCommentReplies;
}

export async function isCommentOwner(userId: string, titleId:string) {
    const getPostId = await prisma.post.findUnique({
        where: {
            titleId: titleId,
            userId:userId
        },
        select:{
            id:true,
        }
    });
    const commentOwner = await prisma.postComment.findFirst({
      where:{
        userId:userId
      },
      select:{
        userId:true
      }
        
    });

    if (!commentOwner) {
        throw new Error("You have no comment for this post yet");
    }
    return {
        commentOwner:commentOwner.userId,
        postOwner:getPostId?.id
    };
}

export async function deleteComments(id: string) {
    const remove = await prisma.postComment.update({
        where: {
            id: id,
        },
        data: {
            isRemoved: true,
        },
        select: {
            isRemoved: true,
        },
    });
    return remove.isRemoved;
}

export async function isPostOwner(id: string) {}
