import TagCard from "@/components/tag/TagCard";
import prisma from "@/db";
import { TagRank } from "@/types/tag";
import { Fragment } from "react";
import { getServerSession } from "next-auth"
import { authConfig } from "@/app/api/auth/[...nextauth]/route"

export default async function Tags() {
    const session = await getServerSession(authConfig)
    const getTags = await prisma.tagsRanking.findFirst({
        orderBy: {
            createdAt: 'desc'
        },
        take: 1,
    })
    
    const tags = getTags?.data as TagRank[]

    return (<div className="mx-auto mt-12 mb-12 lg:mr-28 lg:ml-28 p-4 lg:p-0">
        <h1 className="text-5xl font-bold">Tags</h1>
        <div className="flex flex-wrap gap-2 mt-8">
            {tags && tags.map((tag: TagRank, index: number) => (
                <Fragment key={index}>
                    <TagCard {...tag} isLoggedIn={session ? true : false} />
                </Fragment>
            ))}
        </div>
    </div>)
}