import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";

export async function GET(req: NextRequest): Promise<any> {
    const url = new URL(req.url)

    const sort = url.searchParams.get("sort") as 'recent' | 'unpublished' | 'most-views' | 'most-reactions' | 'most-comments'

    const session = await getServerSession(authConfig)
    interface PrismaQuery {
        where: {
            userId: string
            published?: boolean
        },
        orderBy: {}
    }

    const prismaQuery: PrismaQuery = {
        where: {
            userId: session?.user.id
        },
        orderBy: {
            createdAt: 'desc' // default sorting is it's recent creation
        }
    }
    if (sort === 'recent') {
        orderBy: {
            createdAt: 'desc' // default sorting is it's recent creation
        }
    }

    if (sort === 'unpublished') {
        prismaQuery.where.published = false
    }

    if (sort === 'most-views') {
        prismaQuery.orderBy = {
            views: {
                _count: 'desc'
            }
        }
    }

    if (sort === 'most-reactions') {
        prismaQuery.orderBy = {
            reactions: {
                _count: 'desc'
            }
        }
    }

    if (sort === 'most-comments') {
        prismaQuery.orderBy = {
            comments: {
                _count: 'desc'
            }
        }
    }

    try {
        const posts = await prisma.post.findMany({
            ...prismaQuery,
            select: {
                id: true,
                authorUsername: true,
                userId: true,
                title: true,
                titleId: true,
                published: true,

            }
        })
        return NextResponse.json({ data: posts }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest): Promise<any> {
    const url = new URL(req.url)
    const postId = url.searchParams.get("postId") as string
    const publish = url.searchParams.get('publish') as 'true' | 'false'

    try {
        const publishOrUnpublishPost = await prisma.post.update({
            where: { id: postId },
            data: {
                published: publish === 'true' ? true : false
            }
        })
        if (publishOrUnpublishPost) return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest): Promise<any> {
    const url = new URL(req.url)

    const postId = url.searchParams.get("postId") as string
    try {
        const deletePost = await prisma.post.delete({
            where: { id: postId }
        })
        if (deletePost) return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 500 })
    }

}