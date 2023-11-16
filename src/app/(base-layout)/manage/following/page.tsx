import PeopleContainer from "@/components/people/PeopleContainer"
import TagFollowButton from "@/components/tag/actions/TagFollowButton"
import UserFollowButton from "@/components/user/actions/UserFollowButton"
import prisma from "@/db"
import { authConfig } from "@/utils/authConfig"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { Fragment } from "react"

export default async function ManageFollowing() {
    const session = await getServerSession(authConfig)

    const user = await prisma.user.findUnique({
        where: { id: session?.user.id },
        include: {
            following: true
        }
    })

    const userFollowing = user?.following
    const userTagInterest = user?.interests

    return (
        <div className="container">

            <div className="container">
                <h1 className="text-3xl font-bold">People</h1>
                <div className="flex gap-4 mt-4">
                    {userFollowing && userFollowing.map(following => (
                        <Fragment key={following.id}>
                            <div className="card w-72 bg-base-100 shadow-md">
                                <div className="card-body">
                                    <PeopleContainer {...following} />
                                    <div className="card-actions justify-center">
                                        <UserFollowButton userId={following.id} initialFollowStatus={true} />
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="container mt-8">
                <h1 className="text-3xl font-bold">Tags</h1>
                <div className="flex gap-4 mt-4">
                    {userTagInterest && userTagInterest.map(tag => (
                        <Fragment key={tag}>
                            <div className="container p-4 max-w-xs shadow-md rounded-xl">
                                <div className="flex gap-4 items-center justify-center">
                                    <div className="break-words">
                                        <Link href={`/tag/${tag}`}>
                                            <h2 className="text-2xl font-bold">#{tag}</h2>
                                        </Link>
                                    </div>
                                    <TagFollowButton tag={tag} isLoggedIn={true} />
                                </div>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}