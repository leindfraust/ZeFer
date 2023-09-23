import { authConfig } from "@/app/api/auth/[...nextauth]/route"
import BlogCard from "@/components/blog/BlogCard"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { Fragment } from "react"

export default async function BlogPostSuccess() {
    const session = await getServerSession(authConfig)
    const blog = await prisma.blog.findMany({
        where: {
            userId: session?.user.id,
            new: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    const newBlogs = [...blog]
    if (blog.length !== 0) {
        await prisma.blog.updateMany({
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
        {newBlogs.length === 0 && blog.length === 0 ? notFound() : (
            <div className="hero min-h-screen bg-base-200 -mt-[8vh]">
                <div className="hero-content text-center">
                    <h1 className=" text-5xl font-bold">Congratulations! You have posted {blog.length > 1 ? 'new blogs' : 'a new blog'}.</h1>
                    <div className=" max-w-screen w-3/4 overflow-auto scrollbar-thumb-base-content scrollbar-thin mx-auto space-y-4">
                        <div className="flex justify-center items-center mx-auto w-fit space-x-8">
                            {newBlogs.map(blog => (
                                <Fragment key={blog.id}>
                                    <BlogCard {...blog} />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>)

}