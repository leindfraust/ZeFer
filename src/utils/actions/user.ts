"use server"

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { getServerSession } from "next-auth";

export async function checkUserLoggedIn() {
    const session = await getServerSession(authConfig)
    if (session) return true
    return false
}

async function followUser(userId: string) {
    const session = await getServerSession(authConfig)
    try {
        const follow = await prisma.user.update({
            where: { id: userId },
            data: {
                followedBy: {
                    connect: {
                        id: session?.user.id
                    }
                }
            }
        })
        if (follow) return 'following'
    } catch (err) {
        console.log(err)
        return err
    }
}

async function unfollowUser(userId: string) {
    const session = await getServerSession(authConfig)
    try {
        const unfollow = await prisma.user.update({
            where: { id: userId },
            data: {
                followedBy: {
                    disconnect: {
                        id: session?.user.id
                    }
                }
            }
        })
        if (unfollow) return 'unfollowing'
    } catch (err) {
        return err
    }
}

export async function toggleFollowUser(userId: string) {
    const session = await getServerSession(authConfig)
    const checkUserFollowed = await prisma.user.findUnique({
        where: {
            id: session?.user.id,
            following: {
                some: {
                    id: userId
                }
            }
        },
    })
    if (!checkUserFollowed) return await followUser(userId)
    return await unfollowUser(userId)
}