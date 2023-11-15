import PostContainer from "@/components/post/PostContainer"
import prisma from "@/db"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Fragment } from "react"

export async function generateMetadata({ params }: { params: { userId: string, slug: string } }): Promise<Metadata> {
    const { userId, slug } = params
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: userId,
                },
                {
                    username: userId
                }
            ]
        },
    })
    const postSeries = await prisma.postSeries.findUnique({
        where: {
            id: slug,
            authorId: user?.id
        }
    })
    return {
        title: `${user?.name}'s Series ${postSeries?.title} - ZeFer`,
        description: postSeries?.description,
        authors: [{ name: user?.name as string }]
    }
}

export default async function SeriesUserPage({ params }: { params: { userId: string, slug: string } }) {
    const { userId, slug } = params
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: userId,
                },
                {
                    username: userId
                }
            ]
        },
    })
    const postSeries = await prisma.postSeries.findUnique({
        where: {
            id: slug,
            authorId: user?.id
        },
        include: {
            posts: {
                where: {
                    published: true
                }
            }
        }
    })
    if (!user || !postSeries) return notFound()

    return (<>
        <h1 className="text-2xl font-bold text-info">{user.name}&apos;s <strong>{postSeries.title}</strong> Series</h1>
        {user && postSeries && postSeries.posts.map(post => (
            <Fragment key={post.id}>
                <div className="lg:mr-24 lg:ml-24">
                <PostContainer {...post} />
                </div>
            </Fragment>
        ))}
    </>)
}