import { authConfig } from "@/utils/authConfig"
import PostCard from "@/components/post/PostCard"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { Fragment } from "react"

export default async function PostPostSuccess() {
    const session = await getServerSession(authConfig)
    const post = await prisma.post.findMany({
        where: {
            userId: session?.user.id,
            new: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    const newPosts = [...post]
    if (post.length !== 0) {
        await prisma.post.updateMany({
            where: {
                userId: session?.user.id,
                new: true
            },
            data: {
                new: false
            }
        })
    }
    return (<>
        {newPosts.length === 0 && post.length === 0 ? notFound() : (
            <div className="hero min-h-screen bg-base-200 -mt-[8vh]">
                <div className="hero-content text-center">
                    <h1 className=" text-5xl font-bold">Congratulations! You have posted {post.length > 1 ? 'new posts' : 'a new post'}.</h1>
                    <div className=" max-w-screen w-3/4 overflow-auto scrollbar-thumb-base-content scrollbar-thin mx-auto space-y-4">
                        <div className="flex justify-center items-center mx-auto w-fit space-x-8">
                            {newPosts.map(post => (
                                <Fragment key={post.id}>
                                    <PostCard {...post} />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>)

}