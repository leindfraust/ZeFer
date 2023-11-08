import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import PostList from "@/components/PostList";
import QueryWrapper from "@/components/QueryWrapper";
import PeopleContainer from "@/components/people/PeopleContainer";
import TagFollowButton from "@/components/tag/actions/TagFollowButton";
import prisma from "@/db";
import { TagRank } from "@/types/tag";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export default async function TagPosts({ params }: { params: { slug: string } }) {
    const session = await getServerSession(authConfig)
    const getTags = await prisma.tagsRanking.findFirst({
        take: 1,
        orderBy: {
            createdAt: 'desc'
        }
    })
    const usersWithRelatedTag = await prisma.user.findMany({
        take: 10,
        where: {
            post: {
                some: {
                    tags: {
                        has: params.slug
                    }
                }
            }
        },
        orderBy: {
            post: {
                _count: 'desc'
            }
        },
        select: {
            id: true,
            name: true,
            username: true,
            image: true
        }
    })
    const tag = getTags?.data.find(tag => (tag as TagRank).tag === params.slug) as TagRank
    if (!tag) {
        notFound()
    }
    return (
        <div className="mt-12 mb-12 lg:mr-28 lg:ml-28 p-4 lg:p-0 mx-auto">
            <div className="flex flex-wrap lg:grid lg:grid-cols-2">
                <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-5xl font-bold">
                        #{tag.tag}
                    </h1>
                    <TagFollowButton tag={tag.tag} isLoggedIn={session ? true : false} />
                </div>
                <div className="container">
                    <h2 className="text-lg lg:text-right">{tag.usage} Posts</h2>
                    <h2 className="text-lg lg:text-right">{tag.followers} Followers</h2>
                </div>
            </div>
            <div className="lg:flex justify-center mt-16">
                <div className="mx-auto">
                    <h2 className="text-lg font-bold">People to Follow</h2>
                    <ul className="menu menu-sm rounded-box">
                        <li>
                            {usersWithRelatedTag && usersWithRelatedTag.map(user => (
                                <Fragment key={user.id}>
                                    <PeopleContainer {...user as User} />
                                </Fragment>
                            ))}
                        </li>
                    </ul>
                </div>
                <div className="flex-1 ml-4 mr-4">
                    <QueryWrapper>
                        <PostList tag={params.slug} />
                    </QueryWrapper>
                </div>
            </div>
        </div>
    )
}