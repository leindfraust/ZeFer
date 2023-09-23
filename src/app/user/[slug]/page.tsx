import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBirthdayCake, faBlog, faBriefcase, faEye, faEyeSlash, faLocationPin, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import DisplayImage from "@/components/cloudinary/user/DisplayImage";
import prisma from "@/db";
import type { DisplayImageProps, EditUserDetailsProps, UserSocials } from "@/types/user";
import EditUserDetails from "@/components/modal/user/EditUserDetails";
import BlogContainer from "@/components/blog/BlogContainer";
import { Fragment } from "react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = params
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: slug,
                },
                {
                    vanityUrl: slug //for unique username URL
                }
            ],
        }
    })

    const websiteUrl = (user?.socials as UserSocials[]).find(social => social.name === 'Personal Website')?.url

    return {
        title: `${user?.name} - ZeFer`,
        description: user?.bio,
        openGraph: { images: [user?.image as string] },
        twitter: { site: websiteUrl },
    }
}

export default async function ProfilePage({ params }: Params) {
    const session = await getServerSession(authConfig)
    const { slug } = params
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: slug,
                },
                {
                    vanityUrl: slug //for unique username URL
                }
            ],
        }
    })

    const blogs = await prisma.blog.findMany({
        where: { userId: session?.user.id },
        orderBy: { updatedAt: 'desc' }
    })

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

    const editUserDetailsProps: EditUserDetailsProps = {
        vanityUrl: user.vanityUrl as string,
        name: user.name as string,
        email: user.email as string,
        viewsVisibility: user.viewsVisibility

    }

    const displayImageProps: DisplayImageProps = {
        id: user.id,
        name: user.name as string,
        image: user.image as string,
        session: session?.user.id === user.id ? true : false
    }
    return (<>
        <div className="container mx-auto mb-12 mt-12">
            <div className=" mx-auto p-4 mt-8 mb-8 bg-base-200 rounded shadow-md">
                <DisplayImage {...displayImageProps} />
                <div className="flex items-center justify-center space-x-4">
                    <div className="relative text-center space-y-2 w-1/2">
                        <h3 className=" text-4xl font-bold">{user?.name}</h3>
                        {session?.user.id === user?.id && (
                            <EditUserDetails {...editUserDetailsProps} />
                        )}
                        <p className="text-lg">{user?.bio}</p>
                        <p className="text-xs ">{user.address && (<><FontAwesomeIcon icon={faLocationPin} /> {user.address}, &nbsp; </>)} <FontAwesomeIcon icon={faBirthdayCake} />&nbsp; Joined on {new Date(user?.createdAt).toDateString()}</p>
                    </div>
                    <ViewsVisibility />
                </div>
            </div>
            <div className="flex flex-wrap space-y-12 m-auto mx-4 md:flex-nowrap md:space-x-12 md:space-y-0">
                <div className="container bg-base-200 max-h-96 md:sticky top-24 p-12 space-y-4">
                    <div className="grid grid-cols-2 grid-rows-2 gap-0 items-center">
                        <FontAwesomeIcon icon={faBlog} size="xl" />
                        <p className="text-xl ">{blogs.length} blogs posted</p>
                        <FontAwesomeIcon icon={faPeopleGroup} size="xl" />
                        <p className="text-xl ">{!user.followers ? 0 : user.followers} followers</p>

                        {user.occupation && <>
                            <FontAwesomeIcon icon={faBriefcase} size="xl" />
                            <p className="text-xl">
                                {user.occupation}
                            </p>
                        </>}
                    </div>
                    {user.occupation && <p className="text-xl"><FontAwesomeIcon icon={faBriefcase} />{user.occupation}</p>}
                    <p className="text-xl">Social Links: </p>
                    <ul className="list-disc ml-12">
                        {user.socials.length !== 0 && (user.socials as UserSocials[]).map(social => (
                            <Fragment key={social.name}>
                                {social.url && <li className="text-md"><Link href={social.url.includes('http://') || social.url.includes('https://') ? social.url : `https://${social.url}`} target="_blank"> {social.name} </Link></li>}
                            </Fragment>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    {blogs.length !== 0 ? blogs.map(blog => (
                        <Fragment key={blog.id}>
                            <div className="space-y-6">
                                <BlogContainer {...blog} />
                            </div>
                        </Fragment>
                    )) : (
                        <div className="container mx-auto space-y-4 max-w-sm justify-center items-center p-6">
                            <h1 className="text-xl">
                                No blog posts yet...
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
    )
}