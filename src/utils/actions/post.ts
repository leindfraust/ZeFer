"use server"

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { getServerSession } from "next-auth";

export async function addPostView(postId: string) {
    const postView = await prisma.postView.create({
        data: {
            post: {
                connect: { id: postId }
            }
        }
    })
    if (postView) return true
}

export async function addOrUpdateUserPostReadingHistory(postId: string, readingLengthMs: number) {
    const session = await getServerSession(authConfig)

    async function addPostReadingLength() {
        const newPostReadingLength = await prisma.postReadingLength.create({
            data: {
                postId: postId,
                readingLength: readingLengthMs
            }
        })
        if (newPostReadingLength) return true
    }

    if (!session) {
        await addPostReadingLength()
    } else {
        //find if a reading history already existed
        const getPastReadingHistory = await prisma.postReadingHistory.findUnique({
            where: {
                userId_postId: {
                    userId: session?.user.id,
                    postId: postId
                }
            }
        })
        //if a reading history didn't exist, create a new one
        if (!getPastReadingHistory) {
            //create a reading length first
            const newPostReadingLength = await prisma.postReadingLength.create({
                data: {
                    postId: postId,
                    readingLength: readingLengthMs
                }
            })
            if (newPostReadingLength) {
                //and connect it for the reading history
                const newPostReadingHistory = await prisma.postReadingHistory.create({
                    data: {
                        userId: session?.user.id,
                        postId: postId,
                        readingLengthId: newPostReadingLength.id
                    }
                })
                if (newPostReadingHistory) return true
            }
        } else {
            //increment the reading length
            const updatePostReadingLength = await prisma.postReadingLength.update({
                where: { id: getPastReadingHistory.readingLengthId },
                data: {
                    readingLength: {
                        increment: readingLengthMs
                    }
                }
            })
            if (updatePostReadingLength) return true
        }
    }

}

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