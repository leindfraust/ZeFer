import { Post } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostBookmark from "./actions/PostBookmark";
import { Fragment } from "react";

export default function PostContainer({ coverImage, title, titleId, description, author, userId, authorUsername, authorImage, readPerMinute, published, tags }: Post) {
    return (
        <div className="flex flex-wrap justify-end p-2 lg:block">
            <Link href={`/${authorUsername ? authorUsername : userId}/${titleId}`}>
                <div className="lg:grid lg:grid-cols-2 mx-auto items-center space-y-2 lg:space-y-0">
                    <div className="container space-y-4 break-words">
                        {!published && (
                            <p className="text-sm font-extrabold text-slate-400">UNPUBLISHED</p>
                        )}
                        <h2 className="text-lg lg:text-xl font-bold">{title}</h2>
                        <p className="text-sm lg:text-md">{description}</p>
                        <div className="flex gap-4">
                            {tags && tags.map(tag => (
                                <Fragment key={tag}>
                                    <p className="badge badge-sm badge-neutral">{tag}</p>
                                </Fragment>
                            ))}
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="avatar">
                                <div className="rounded-full">
                                    <Image src={authorImage} alt={author} width={25} height={25} />
                                </div>
                            </div>
                            <div className="container">
                                <p className="text-sm">{author} <strong>·</strong> {readPerMinute} min read</p>
                            </div>
                        </div>
                    </div>
                    <figure className="lg:w-9/12 ml-auto">
                        <Image src={coverImage as string} alt="cover_image" width={1920} height={1080} className="float-right rounded-lg" />
                    </figure>
                </div>
            </Link>
            <div className="flex items-center mt-2 container">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Link href={`/${authorUsername ? authorUsername : userId}/${titleId}`}><FontAwesomeIcon icon={faHeart} size="lg" title="Reactions" /></Link>
                            <div>
                                0
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faComment} size="lg" title="Comments" />
                            <div>
                                0
                            </div>
                        </div>
                    </div>
                </div>
                <PostBookmark titleId={titleId} faSize={'lg'} />
            </div>
        </div>
    )
}