import { NextResponse } from "next/server";
import prisma from "@/db";

export async function GET(): Promise<any> {

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

        return NextResponse.json(Array.from(new Set(tags)).sort(), { status: 200 })
    } catch (err) {
        return NextResponse.json([err], { status: 500 })
    }
}