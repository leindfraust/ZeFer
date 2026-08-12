"use server"

import { auth } from "@/auth";
import prisma from "@/db";

export async function checkUserLoggedIn() {
    const session = await auth()
    if (session) return true
    return false
}

async function followUser(userId: string) {
    const session = await auth()
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
    const session = await auth()
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
    const session = await auth()
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

export async function updateNotificationPreferences(data: {
    sendNotificationEmail?: boolean;
    sendNotificationPhone?: boolean;
}) {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                sendNotificationEmail: data.sendNotificationEmail,
                sendNotificationPhone: data.sendNotificationPhone,
            },
            select: {
                sendNotificationEmail: true,
                sendNotificationPhone: true,
            },
        });

        return { success: true, data: updatedUser };
    } catch (error) {
        console.error("Error updating notification preferences:", error);
        return { success: false, error: "Failed to update preferences" };
    }
}