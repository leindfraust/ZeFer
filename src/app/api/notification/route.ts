import prisma from "@/db";
import { authConfig } from "@/utils/authConfig";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const keyword = url && url.searchParams.get("q");
    const session = await getServerSession(authConfig);
    const getNotifications = await prisma.userNotifications.findMany({
        where: {
            userId: session?.user.id,
            OR: [
                {
                    fromUserId: {
                        not: session?.user.id,
                    },
                },
                {
                    fromUserId: null,
                },
            ],
            ...(keyword && {
                message: {
                    search: keyword,
                },
            }),
        },
        include: {
            post: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return NextResponse.json({ data: getNotifications }, { status: 200 });
}
