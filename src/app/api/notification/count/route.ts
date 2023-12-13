import prisma from "@/db"
import { authConfig } from "@/utils/authConfig"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await getServerSession(authConfig)
    const getNotifications = await prisma.userNotifications.count({
        where: {
            userId: session?.user.id,
            new: true
        }
    })
    return NextResponse.json({ data: getNotifications }, { status: 200 })
}