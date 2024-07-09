import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBirthdayCake,
    faBlog,
    faBriefcase,
    faLocationPin,
    faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import type { FormSocials } from "@/types/user";
import { Fragment, Suspense } from "react";
import Link from "next/link";
import PostList from "@/components/post/PostList";
import Image from "next/image";
import QueryWrapper from "@/components/provider/QueryWrapper";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import UserFollowButton from "@/components/user/actions/UserFollowButton";
import { Organization, User } from "@prisma/client";

const UserOrgProfile = async ({
    user,
    userId,
    checkIfUserAlreadyFollowed,
    posts,
    followers,
    org,
    orgId,
    members,
}: {
    user?: User;
    org?: Organization;
    userId?: string;
    checkIfUserAlreadyFollowed?: boolean;
    posts?: number;
    followers?: number;
    orgId?: string;
    members?: number;
}) => {
    const session = await getServerSession(authConfig);
    return (
        <>
            <div className="mx-auto mb-12 mt-12 mr-4 ml-4 lg:mr-28 lg:ml-28">
                <div className="relative container p-4 mt-8 mb-8 rounded shadow-md mx-auto">
                    <div className="avatar flex justify-center mb-4">
                        <div className="lg:w-64 w-32 rounded-full">
                            <Image
                                src={user?.image ?? (org?.image as string)}
                                alt={user?.name as string}
                                height={150}
                                width={150}
                                priority
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="relative text-center space-y-2 w-1/2">
                            <h3 className=" text-4xl font-bold">
                                {user && user.name ? user.name : org?.name}
                            </h3>
                            <p className="text-lg">{user ? user.bio : org?.username}</p>
                            <p className="text-xs ">
                                {user && user.address && (
                                    <>
                                        <FontAwesomeIcon icon={faLocationPin} />{" "}
                                        {user.address}, &nbsp;{" "}
                                    </>
                                )}{" "}
                                <FontAwesomeIcon icon={faBirthdayCake} />
                                &nbsp;
                                {user ? (
                                    <span>
                                        {" "}
                                        Joined on{" "}
                                        {new Date(
                                            user.createdAt,
                                        ).toDateString()}
                                    </span>
                                ) : org ? (
                                    <span>
                                        Created on {" "}
                                        {new Date(org.createdAt).toDateString()}{" "}
                                    </span>
                                ) : null}
                            </p>
                        </div>
                    </div>
                    {user && session && session.user.id !== user.id && (
                        <div className="flex justify-center mt-2 lg:flex-none lg:mt-0">
                            <div className="lg:block lg:absolute top-5 right-5">
                                <UserFollowButton
                                    userId={user.id}
                                    initialFollowStatus={
                                        checkIfUserAlreadyFollowed as boolean
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap mx-auto lg:flex-nowrap md:space-x-12 md:space-y-0">
                    <div className="lg:w-1/4 mx-auto rounded shadow-md h-2/4 md:sticky top-24 p-12 space-y-4 mb-12 lg:mb-0">
                        <div className="flex item-center space-x-4">
                            <FontAwesomeIcon
                                width={24}
                                icon={faBlog}
                                size="lg"
                            />
                            <p className="text-lg ">{posts} posts posted</p>
                        </div>
                        <div className="flex item-center space-x-4">
                            <FontAwesomeIcon
                                width={24}
                                icon={faPeopleGroup}
                                size="lg"
                            />
                            <p className="text-lg ">
                                {user 
                                    ? `${followers} followers`
                                    : `${members} members`}
                            </p>
                        </div>
                        {user && user.occupation && (
                            <div className="flex item-center space-x-4">
                                <FontAwesomeIcon
                                    width={24}
                                    icon={faBriefcase}
                                    size="lg"
                                />
                                <p className="text-lg">{user.occupation}</p>
                            </div>
                        )}
                        {(
                            (user?.socials as FormSocials[]) ??
                            (org?.socials as FormSocials[])
                        ).find((social) => social?.url !== "") && (
                            <>
                                <p className="text-xl">Social Links: </p>
                                <ul className="list-disc ml-12">
                                    {(
                                        (user?.socials as FormSocials[]) ??
                                        (org?.socials as FormSocials[])
                                    ).map((social) => (
                                        <Fragment key={social.name}>
                                            {social.url && (
                                                <li className="text-md">
                                                    <Link
                                                        href={
                                                            social.url.includes(
                                                                "http://",
                                                            ) ||
                                                            social.url.includes(
                                                                "https://",
                                                            )
                                                                ? social.url
                                                                : `https://${social.url}`
                                                        }
                                                        target="_blank"
                                                    >
                                                        {" "}
                                                        {social.name}{" "}
                                                    </Link>
                                                </li>
                                            )}
                                        </Fragment>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                    <div className="w-full">
                        {posts === 0 && (
                            <div className="flex items-center md:justify-normal justify-center font-bold text-gray-600 w-full h-full md:ml-[400px] md:text-xl text-md">
                                <span>No post from user yet</span>
                            </div>
                        )}
                        <QueryWrapper>
                            <Suspense>
                                <PostList userId={userId} orgId={orgId} />
                            </Suspense>
                        </QueryWrapper>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserOrgProfile;
