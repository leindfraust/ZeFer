"use server"

import { authConfig } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/db"
import { getServerSession } from "next-auth"

export async function updateInterest(tag: string) {
    const session = await getServerSession(authConfig)
    try {
        const getUser = await prisma.user.findUnique({
            where: {
                id: session?.user.id
            }
        })
        //if user hasn't followed the tag
        const ifNotFollowing = getUser?.interests.filter((interest: string) => interest === tag)
        if (ifNotFollowing?.length === 0) {
            const updateUser = await prisma.user.update({
                where: {
                    id: session?.user.id,
                },
                data: {
                    interests: {
                        push: tag
                    }
                }
            })
            if (updateUser) return 'following'
        }
        // unfollow tag
        const newInterests = [...(getUser?.interests as string[]).filter(interest => interest !== tag)]
        const updateUser = await prisma.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                interests: newInterests
            }
        })
        if (updateUser) return 'unfollowing'
    } catch (err) {
        console.log(err)
        return err
    }
}

export async function ifTagFollowing(tag: string) {
    const session = await getServerSession(authConfig)
    const tagFollowed = await prisma.user.findUnique({
        where: {
            id: session?.user.id,
            interests: {
                has: tag
            }
        }
    })
    if (tagFollowed) return true
    return false
}
