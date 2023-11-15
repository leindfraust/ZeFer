import { notFound } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBirthdayCake, faBlog, faBriefcase, faEye, faEyeSlash, faLocationPin, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import prisma from "@/db";
import type { UserSocials } from "@/types/user";
import { Fragment } from "react";
import Link from "next/link";
import { Metadata } from "next";
import PostList from "@/components/PostList";
import Image from "next/image";
import QueryWrapper from "@/components/QueryWrapper";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import UserFollowButton from "@/components/user/actions/UserFollowButton";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
    const { userId } = params
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: userId,
                },
                {
                    username: userId //for unique username URL
                }
            ],
        }
    })
    if (!user) return notFound()
    const websiteUrl = (user?.socials as UserSocials[]).find(social => social.name === 'Personal Website')?.url

    return {
        title: `${user?.name} - ZeFer`,
        description: user?.bio,
        openGraph: { images: [user?.image as string] },
        twitter: { site: websiteUrl },
    }
}

export default async function ProfilePage({ params }: { params: { userId: string } }) {
    const { userId } = params
    const session = await getServerSession(authConfig)
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: userId,
                },
                {
                    username: userId //for unique username URL
                }
            ],
        },
        include: {
            _count: {
                select: {
                    post: {
                        where: {
                            published: true
                        }
                    },
                    followedBy: true
                }
            }
        }
    })

    const followers = user?._count.followedBy
    const posts = user?._count.post

    if (!user) {
        notFound()
    }

    function ViewsVisibility() {
        if (user?.viewsVisibility) {
            if (user.views !== null) {
                return (
                    <div className="relative text-sm">
                        <FontAwesomeIcon icon={faEye} /> {user?.views}
                    </div>
                )
            }
        } else {
            return (
                <div className="relative text-sm">
                    <FontAwesomeIcon icon={faEyeSlash} />
                </div>
            )
        }
    }

    async function checkUserIfFollowing() {
        if (session) {
            const checkUserFollowed = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                    following: {
                        some: {
                            id: user?.id
                        }
                    }
                },
            })
            if (checkUserFollowed) return true
            return false
        }
    }
    const checkIfUserAlreadyFollowed = await checkUserIfFollowing() as boolean

    return (<>
        <div className="mx-auto mb-12 mt-12 mr-4 ml-4 lg:mr-28 lg:ml-28">
            <div className="relative container p-4 mt-8 mb-8 bg-base-200 rounded shadow-md mx-auto">
                <div className="avatar flex justify-center mb-4">
                    <div className="lg:w-64 w-32 rounded-full">
                        <Image src={user.image} alt={user.name as string} height={150} width={150} priority />
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    <div className="relative text-center space-y-2 w-1/2">
                        <h3 className=" text-4xl font-bold">{user?.name}</h3>
                        <p className="text-lg">{user?.bio}</p>
                        <p className="text-xs ">{user.address && (<><FontAwesomeIcon icon={faLocationPin} /> {user.address}, &nbsp; </>)} <FontAwesomeIcon icon={faBirthdayCake} />&nbsp; Joined on {new Date(user?.createdAt).toDateString()}</p>
                    </div>
                    <ViewsVisibility />
                </div>
                {session && session.user.id !== user.id && (
                    <UserFollowButton userId={user.id} initialFollowStatus={checkIfUserAlreadyFollowed} />
                )}
            </div>
            <div className="flex flex-wrap mx-auto lg:flex-nowrap md:space-x-12 md:space-y-0">
                <div className="lg:w-1/4 mx-auto bg-base-200 rounded shadow-md h-2/4 md:sticky top-24 p-12 space-y-4 mb-12 lg:mb-0">
                    <div className="flex item-center space-x-4">
                        <FontAwesomeIcon width={24} icon={faBlog} size="lg" />
                        <p className="text-lg ">{posts} posts posted</p>
                    </div>
                    <div className="flex item-center space-x-4">
                        <FontAwesomeIcon width={24} icon={faPeopleGroup} size="lg" />
                        <p className="text-lg ">{followers} followers</p>
                    </div>
                    {user.occupation &&
                        <div className="flex item-center space-x-4">
                            <FontAwesomeIcon width={24} icon={faBriefcase} size="lg" />
                            <p className="text-lg">
                                {user.occupation}
                            </p>
                        </div>}
                    {user.occupation && <p className="text-xl"><FontAwesomeIcon icon={faBriefcase} />{user.occupation}</p>}
                    {(user.socials as UserSocials[]).find(social => social?.url !== '') && (
                        <>
                            <p className="text-xl">Social Links: </p>
                            <ul className="list-disc ml-12">
                                {(user.socials as UserSocials[]).map(social => (
                                    <Fragment key={social.name}>
                                        {social.url && <li className="text-md"><Link href={social.url.includes('http://') || social.url.includes('https://') ? social.url : `https://${social.url}`} target="_blank"> {social.name} </Link></li>}
                                    </Fragment>
                                ))}
                            </ul>
                        </>)}
                </div>
                <div className="w-full">
                    <QueryWrapper>
                        <PostList tag="" userId={userId} />
                    </QueryWrapper>
                </div>
            </div>
        </div>
    </>
    )
}