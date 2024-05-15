import { Post } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostBookmark from "./actions/PostBookmark";
import { Fragment, useEffect, useMemo, useState } from "react";
import timeDiff from "@/utils/timeDiffCalc";
import { getOrg } from "@/utils/actions/organization";
import { cn } from "@/utils/cn";
interface OrgType {
    name: string;
    image: string;
}
export default function PostContainer({
    coverImage,
    title,
    titleId,
    description,
    author,
    userId,
    authorUsername,
    authorImage,
    readPerMinute,
    published,
    tags,
    _count,
    createdAt,
    organizationId,
}: Post & {
    _count?: {
        reactions: number;
        comments: number;
    };
}) {
    const [org, setOrg] = useState<OrgType | undefined>();
    const timeDiffCalc = useMemo(() => {
        return timeDiff(createdAt);
    }, [createdAt]);
    useEffect(() => {
        const fetchOrg = async () => {
            const fetch = await getOrg(organizationId);
            setOrg(fetch);
        };
        fetchOrg();
    }, [organizationId]);
    return (
        <div className="flex flex-wrap justify-end p-2 lg:block border-b pb-6">
            <Link
                href={`/${authorUsername ? authorUsername : userId}/${titleId}`}
            >
                <div className="lg:grid lg:grid-cols-2 mx-auto items-center space-y-2 lg:space-y-0">
                    <div className="container space-y-1 break-words">
                        {!published && (
                            <p className="text-sm font-extrabold text-slate-400">
                                UNPUBLISHED
                            </p>
                        )}
                        <div className="flex gap-2 items-center relative">
                            <div className="flex flex-row-reverse items-center gap-1 relative">
                            <div className={cn("avatar", {"absolute top-6 left-[25px] z-10": organizationId})}>
                                <div className="w-7 rounded-full">
                                    <Image
                                        src={authorImage}
                                        alt={author}
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </div>
                            {organizationId && (
                                <div className="avatar">
                                    <div className="w-12 rounded">
                                        <Image
                                            src={org?.image as string}
                                            alt={org?.name as string}
                                            width={64}
                                            height={64}
                                        />
                                    </div>
                                </div>
                            )}
                            </div>
                            <div className="container">
                                <p className="text-xs ml-1">
                                    {organizationId
                                        ? `${author} for ${org?.name}`
                                        : author}
                                </p>
                                <p className="text-xs ml-1">
                                    {new Date(createdAt).toLocaleDateString(
                                        undefined,
                                        {
                                            month: "short",
                                            year:
                                                new Date().getFullYear() ===
                                                new Date(
                                                    createdAt,
                                                ).getFullYear()
                                                    ? undefined
                                                    : "numeric",
                                            day: "numeric",
                                        },
                                    )}{" "}
                                    ({timeDiffCalc})
                                </p>
                            </div>
                        </div>
                        <h1 className="text-lg lg:text-2xl font-bold">
                            {title}
                        </h1>
                        <p className="text-sm lg:text-md">{description}</p>
                        <div className="!mt-4 space-y-4">
                            {tags && (
                                <div className="flex gap-2 flex-wrap">
                                    {tags.map((tag) => (
                                        <Fragment key={tag}>
                                            <p className="badge badge-sm badge-neutral">
                                                {tag}
                                            </p>
                                        </Fragment>
                                    ))}
                                </div>
                            )}
                            <p className="text-sm text-slate-500">
                                {readPerMinute} min read
                            </p>
                        </div>
                    </div>
                    <figure className="lg:w-9/12 ml-auto">
                        <Image
                            src={coverImage as string}
                            alt="cover_image"
                            width={1920}
                            height={1080}
                            className="float-right rounded-lg"
                        />
                    </figure>
                </div>
            </Link>
            <div className="flex items-center mt-2 container">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/${
                                    authorUsername ? authorUsername : userId
                                }/${titleId}`}
                            >
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    size="lg"
                                    title="Reactions"
                                />
                            </Link>
                            <div>{_count?.reactions}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon
                                icon={faComment}
                                size="lg"
                                title="Comments"
                            />
                            <div>{_count?.comments}</div>
                        </div>
                    </div>
                </div>
                <PostBookmark titleId={titleId} faSize={"lg"} />
            </div>
        </div>
    );
}
