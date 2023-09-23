import { NextResponse } from "next/server";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { getServerSession } from "next-auth";

export async function PATCH(req: Request) {
    const body = await req.json()
    const session = await getServerSession(authConfig)
    try {
        const user = await prisma.user.update({
            where: { id: session?.user.id },
            data: {
                ...body
            }
        })
        const updateBlogs = await prisma.blog.updateMany({
            where: { userId: session?.user.id },
            data: {
                author: body.name
            }
        })
        if (user && updateBlogs) {
            return NextResponse.json({ status: 200 })
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}