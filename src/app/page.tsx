import PostList from "@/components/PostList"
import QueryWrapper from "@/components/QueryWrapper"
import prisma from "@/db"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { Fragment } from "react"
import { authConfig } from "./api/auth/[...nextauth]/route"
import Navigation from "@/components/Navigation"
import { User } from '@prisma/client';
import SideMenu from "@/components/menu/SideMenu"
import TagRankingMenu from "@/components/menu/TagRankingMenu"


export default async function Home() {
  const session = await getServerSession(authConfig)

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id ?? '' },
    select: {
      name: true,
      image: true,
      id: true,
      username: true
    }
  }) as User

  return (<>
    <Navigation {...user} />
    {!session && <div className="hero min-h-[60vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-7xl lg:text-7xl font-bold">ZeFer</h1>
          <h1 className="text-xl lg:text-3xl  font-bold">Tell your story to the world.</h1>
          <Link href={'/'} className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>}
    <div className="mx-auto mt-12 mb-12 lg:mr-28 lg:ml-28">
      <div className="flex justify-center">

        <div className="hidden lg:block w-1/4">
          <SideMenu />
        </div>

        <div className="w-full ml-4 mr-4">
          <QueryWrapper>
            <PostList />
          </QueryWrapper>
        </div>

        <div className="hidden lg:block w-1/4">
          <TagRankingMenu />
        </div>
      </div>
    </div>
  </>)
}
