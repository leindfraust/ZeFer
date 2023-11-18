import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<any> {
    const session = await getServerSession(authConfig)
    try {
        const getSeries = await prisma.postSeries.findMany({
            where: {
                authorId: session?.user.id
            },
            include: {
                posts: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })
        return NextResponse.json({ data: getSeries }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

export async function PUT(req: NextRequest): Promise<any> {
    const session = await getServerSession(authConfig)
    const url = new URL(req.url)
    const seriesId = url.searchParams.get("seriesId") as string

    const body = await req.formData()
    const title = body.get('title') as string
    const description = body.get('description') as string
    try {
        const postSeries = await prisma.postSeries.update({
            where: {
                authorId: session?.user.id,
                id: seriesId
            },
            data: {
                title,
                description
            }
        })
        if (postSeries) return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

export async function POST(req: NextRequest): Promise<any> {
    const session = await getServerSession(authConfig)
    const body = await req.formData()
    const title = body.get('title') as string
    const description = body.get('description') as string

    try {
        const postSeries = await prisma.postSeries.create({
            data: {
                title: title,
                description: description as string || '',
                author: {
                    connect: {
                        id: session?.user.id
                    }
                }
            }
        })
        console.log(postSeries)
        if (postSeries) return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 200 })
    }
}

export async function DELETE(req: NextRequest): Promise<any> {
    const session = await getServerSession(authConfig)
    const url = new URL(req.url)
    const seriesId = url.searchParams.get("seriesId")

    try {
        const deleteSeries = await prisma.postSeries.delete({
            where: {
                authorId: session?.user.id,
                id: seriesId as string
            }
        })
        if (deleteSeries) return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}