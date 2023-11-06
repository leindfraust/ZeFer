import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function GET(req?: NextRequest): Promise<any> {
    const url = req && new URL(req?.url)
    const keyword = url && url.searchParams.get('q')

    const default_tags = [
        "travel",
        "food",
        "lifestyle",
        "fashion",
        "beauty",
        "health",
        "fitness",
        "technology",
        "business",
        "finance",
        "parenting",
        "education",
        "photography",
        "art",
        "books",
        "movies",
        "music",
        "crafts",
        "diy",
        "gardening",
        "home",
        "inspiration",
        "motivation",
        "personal",
        "productivity",
        "relationships",
        "self-improvement",
        "sustainability",
        "weddings",
        "celebrities",
        "culture",
        "humor",
        "sports"
    ]
    try {
        const postTags = await prisma.post.findMany({
            select: {
                tags: true
            }
        })
        let tags: string[] = [...default_tags] //add default tags
        for (const tag of postTags) {
            tags.push(...tag.tags)
        }

        const response = () => {
            if (keyword) {
                return Array.from(new Set(tags)).filter(tag => tag.includes(keyword)).sort()
            }
            return Array.from(new Set(tags)).sort()
        }

        return NextResponse.json(response(), { status: 200 })
    } catch (err) {
        return NextResponse.json([err], { status: 500 })
    }
}