import { Post } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostBookmark from "./actions/PostBookmark";
import { Fragment, useMemo } from "react";

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
}: Post & {
    _count?: {
        reactions: number;
        comments: number;
    };
}) {
    const timeDiff = useMemo(() => {
        const timeDiff = new Date().getTime() - new Date(createdAt).getTime();

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));

        if (months) return `${months} ${months > 1 ? "months" : "month"} ago`;
        if (days) return `${days} ${days > 1 ? "days" : "day"} ago`;
        if (hours) return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
        if (minutes)
            return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
        if (seconds)
            return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
    }, [createdAt]);

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
                        <div className="flex gap-2 items-center">
                            <div className="avatar">
                                <div className="w-7 rounded-full">
                                    <Image
                                        src={authorImage}
                                        alt={author}
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </div>
                            <div className="container">
                                <p className="text-xs">
                                    {author} <strong>·</strong>{" "}
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
                                    ({timeDiff})
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
