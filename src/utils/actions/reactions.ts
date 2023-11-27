"use server"

import { getServerSession } from "next-auth"
import { authConfig } from "../authConfig"
import prisma from "@/db"

export async function getInitialPostReaction(postId: string) {
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

export async function updateCreatePostReaction(postId: string, type: 'heart') {
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