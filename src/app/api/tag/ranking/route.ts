import { NextRequest, NextResponse } from "next/server";
import { TagRank } from "@/types/tag";
import prisma from "@/db";

export async function GET(req: NextRequest): Promise<any> {
    const url = new URL(req.url)
    const keyword = url && url.searchParams.get('q')
    const tagRankings = await prisma.tagsRanking.findFirst({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const response = async () => {
        if (keyword) {
            return (tagRankings?.data as TagRank[]).filter((tag: TagRank) => tag.tag.toLowerCase().includes(keyword.toLowerCase()))
        }
        return tagRankings?.data
    }


    return NextResponse.json(await response(), { status: 200 })

}