import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
type PrismaWhereQuery = {
    where: {
        series?: {}
        NOT?: {
            series: {}
        }
    }
}

export async function GET(req: NextRequest): Promise<any> {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') as 'add' | 'remove'
    const seriesId = url.searchParams.get('seriesId') as string
    const seriesTitle = url.searchParams.get('seriesTitle') as string

    let prismaWhereQuery: PrismaWhereQuery = {
        where: {
            NOT: {
                series: {
                    some: {
                        id: seriesId,
                        title: seriesTitle
                    }
                }
            }
        }
    }

    if (action === 'remove') {
        prismaWhereQuery.where = {
            series: {
                some: {
                    id: seriesId,
                    title: seriesTitle
                }
            }
        }
    }

    try {
        const getPosts = await prisma.post.findMany({
            ...prismaWhereQuery,
            orderBy: {
                createdAt: 'desc'
            }
        })
        if (getPosts) return NextResponse.json({ data: getPosts }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

export async function POST(req: NextRequest): Promise<any> {
    const url = new URL(req.url)
    const seriesId = url.searchParams.get('seriesId') as string
    const postId = url.searchParams.get('postId') as string

    try {
        const addPostToSeries = await prisma.postSeries.update({
            where: { id: seriesId },
            data: {
                posts: {
                    connect: {
                        id: postId
                    }
                }
            }
        })
        if (addPostToSeries) return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest): Promise<any> {
    const url = new URL(req.url)
    const seriesId = url.searchParams.get('seriesId') as string
    const postId = url.searchParams.get('postId') as string

    try {
        const addPostToSeries = await prisma.postSeries.update({
            where: { id: seriesId },
            data: {
                posts: {
                    disconnect: {
                        id: postId
                    }
                }
            }
        })
        if (addPostToSeries) return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}