import BlogContainer from "@/components/blog/BlogContainer"
import prisma from "@/db"
import Link from "next/link"
import { Fragment } from "react"

export default async function Home() {

  const blogs = await prisma.blog.findMany({
    take: 10
  })

  return (<>
    <div className="hero min-h-[60vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-4">
          <h1 className=" text-9xl font-bold">ZeFer</h1>
          <h1 className="text-3xl font-bold">Tell your story to the world.</h1>
          <Link href={'/'} className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
    <div className="container mx-auto mt-12 mb-12 space-y-12">
      <h3 className="text-7xl font-bold mb-12">Trending</h3>
      {blogs.length !== 0 && blogs.map(blog => (
        <Fragment key={blog.id}>
          <div className="container">
            <BlogContainer {...blog} />
          </div>
        </Fragment>
      ))}
    </div>
  </>)
}
