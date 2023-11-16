import prisma from "@/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ status: 401 })
    }

    try {
        //get all posts
        const posts = await prisma.post.findMany()
        //push all tags from a post
        const tags: string[] = []
        posts.forEach(post => post.tags.forEach(tag => tags.push(tag)))

        //remove duplication
        const setTags = [...new Set(tags)]

        type TagRank = {
            tag: string;
            usage: number
            followers: number
        }

        const tagRanks = async () => {
            const tagRanking: TagRank[] = [];
            for (const setTag of setTags) {
                const tagFollowers = await prisma.user.count({
                    where: {
                        interests: {
                            has: setTag
                        }
                    }
                });

                tagRanking.push({
                    tag: setTag,
                    usage: tags.filter(tag => tag === setTag).length,
                    followers: tagFollowers
                });
            }
            return tagRanking;
        };

        const createTagRank = await prisma.tagsRanking.create({
            data: {
                data: await tagRanks()
            }
        })
        if (createTagRank) return NextResponse.json({ status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}