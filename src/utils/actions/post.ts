"use server"

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { getServerSession } from "next-auth";


async function bookmarkPost(titleId: string) {
    const session = await getServerSession(authConfig)

    try {
        const bookmarkPost = await prisma.user.update({
            where: { id: session?.user.id },
            data: {
                bookMarks: {
                    connect: {
                        titleId: titleId
                    }
                }
            }
        })
        if (bookmarkPost) return 'bookmarked'
        return 'unbookmarked'
    } catch (err) {
        return err
    }


}
async function unBookmarkPost(titleId: string) {
    const session = await getServerSession(authConfig)

    try {
        const unBookmarkPost = await prisma.user.update({
            where: { id: session?.user.id },
            data: {
                bookMarks: {
                    disconnect: {
                        titleId: titleId
                    }
                }
            }
        })
        if (unBookmarkPost) return 'unbookmarked'
        return 'bookmarked'
    } catch (err) {
        return err
    }
}


export async function checkBookmarkPostStatus(titleId: string) {
    const session = await getServerSession(authConfig)
    try {
        const checkBookmarkPost = await prisma.user.findUnique({
            where: {
                id: session?.user.id,
                bookMarks: {
                    some: {
                        titleId: titleId
                    }
                }
            },
        })
        if (checkBookmarkPost) return 'bookmarked'
        return 'unbookmarked'
    } catch (err) {
        return err
    }
}

export async function setBookmarkPost(titleId: string) {
    const session = await getServerSession(authConfig)
    try {
        const checkBookmarkPost = await prisma.user.findUnique({
            where: {
                id: session?.user.id,
                bookMarks: {
                    some: {
                        titleId: titleId
                    }
                }
            },
        })
        if (!checkBookmarkPost) {
            return await bookmarkPost(titleId)
        } else {
            return await unBookmarkPost(titleId)
        }
    } catch (err) {
        return err
    }
}