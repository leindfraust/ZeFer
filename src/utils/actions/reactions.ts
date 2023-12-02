"use server"

import { getServerSession } from "next-auth"
import { authConfig } from "../authConfig"
import prisma from "@/db"
import { TCommentReaction, TPostReaction } from "@/types/reaction"

export async function getUserInitialPostReaction(postId: string) {
    const session = await getServerSession(authConfig)

    const checkPostReaction = await prisma.postReaction.findUnique({
        where: {
            postId_userId: {
                postId: postId,
                userId: session?.user.id
            }
        }
    })
    if (checkPostReaction) return checkPostReaction.type
    return false
}

export async function updateCreatePostReaction(postId: string, type: TPostReaction) {
    const session = await getServerSession(authConfig)

    try {
        const addPostReaction = await prisma.postReaction.upsert({
            where: {
                postId_userId: {
                    userId: session?.user.id,
                    postId: postId
                }
            },
            update: {
                type: type
            },
            create: {
                type: type,
                post: {
                    connect: {
                        id: postId
                    }
                },
                user: {
                    connect: {
                        id: session?.user.id
                    }
                }
            }
        })
        if (addPostReaction) return true
    } catch (error) {
        return error
    }
}

export async function deletePostReaction(postId: string) {
    const session = await getServerSession(authConfig)

    try {
        const deletePostReaction = await prisma.postReaction.delete({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: session?.user.id
                }
            }
        })
        if (deletePostReaction) return true
    } catch (error) {
        return error
    }
}

export async function getInitialCommentReaction(commentId: string) {
    const session = await getServerSession(authConfig)

    const checkCommentReaction = await prisma.commentReaction.findUnique({
        where: {
            commentId_userId: {
                commentId: commentId,
                userId: session?.user.id
            }
        }
    })

    if (checkCommentReaction) return checkCommentReaction.type
    return false
}

export async function updateCreateCommentReaction(commentId: string, type: TCommentReaction) {
    const session = await getServerSession(authConfig)

    try {
        const addCommentReaction = await prisma.commentReaction.upsert({
            where: {
                commentId_userId: {
                    commentId: commentId,
                    userId: session?.user.id
                },
            },
            update: {
                type: type
            },
            create: {
                type: 'heart',
                comment: {
                    connect: {
                        id: commentId
                    },
                },
                user: {
                    connect: {
                        id: session?.user.id
                    }
                }
            }
        })
        if (addCommentReaction) return true
    } catch (err) {
        return err
    }
}

export async function deleteCommentReaction(commentId: string) {
    const session = await getServerSession(authConfig)

    try {
        const deleteCommentReaction = await prisma.commentReaction.delete({
            where: {
                commentId_userId: {
                    commentId: commentId,
                    userId: session?.user.id
                }
            }
        })
        if (deleteCommentReaction) return true
    } catch (error) {
        return error
    }
}