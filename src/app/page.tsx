import PostList from "@/components/PostList"
import QueryWrapper from "@/components/QueryWrapper"
import prisma from "@/db"
import { TagRank } from "@/types/tag"
import { faBookmark, faEyeSlash, faFire, faHashtag, faMagnifyingGlass, faPhone, faQuestion, faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { Fragment } from "react"
import { authConfig } from "./api/auth/[...nextauth]/route"
import Navigation from "@/components/Navigation"
import { User } from '@prisma/client';


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

  const tagsRanking = await prisma.tagsRanking.findFirst({
    orderBy: {
      createdAt: 'desc'
    },
    take: 1
  })
  return (<>
    <Navigation {...user} />
    <div className="hero min-h-[60vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-7xl lg:text-7xl font-bold">ZeFer</h1>
          <h1 className="text-xl lg:text-3xl  font-bold">Tell your story to the world.</h1>
          <Link href={'/'} className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-12 mb-12 lg:mr-28 lg:ml-28">
      <div className="flex justify-center">

        <div className="hidden lg:block w-1/4">
          <ul className="menu rounded-box">
            <li>
              <a>
                <FontAwesomeIcon icon={faBookmark} width={20} />
                Bookmarks
              </a>
            </li>
            <li>
              <Link href={'/tag'}>
                <FontAwesomeIcon icon={faHashtag} width={20} />
                Tags
              </Link>
            </li>
            <li>
              <a className="text-sm">
                <FontAwesomeIcon icon={faQuestion} width={20} />
                About
              </a>
            </li>
            <li>
              <a>
                <FontAwesomeIcon icon={faPhone} width={20} />
                Contact
              </a>
            </li>
            <div className="divider divider-vertical"></div>
            <li>
              <a>
                <FontAwesomeIcon icon={faEyeSlash} width={20} />
                Privacy Policy
              </a>
            </li>
            <li>
              <a>
                <FontAwesomeIcon icon={faThumbsUp} width={20} />
                Code of Conduct
              </a>
            </li>
            <li>
              <a>
                <FontAwesomeIcon icon={faMagnifyingGlass} width={20} />
                Terms and Conditions
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full ml-4 mr-4">
          <QueryWrapper>
            <PostList />
          </QueryWrapper>
        </div>

        <div className="hidden lg:block w-1/4">
          <div className="container p-6">
            <div className="flex items-center space-x-1 mb-4">
              <h3 className="text-lg">Trending tags</h3>
              <FontAwesomeIcon icon={faFire} />
            </div>
            <ul className="space-y-2 text-sm">
              {tagsRanking && (tagsRanking.data as TagRank[]).map((tag: TagRank, index) => (
                <Fragment key={index}>
                  <li>#{tag.tag}</li>
                </Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </>)
}
