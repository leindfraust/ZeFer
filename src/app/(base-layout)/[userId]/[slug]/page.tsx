import prisma from "@/db";
import type { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html";
import parse from "html-react-parser";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Fragment } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComment,
    // faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { faComment as faRegComment } from "@fortawesome/free-regular-svg-icons";
import PostSlugWatcher from "@/components/provider/PostSlugWatcher";
import PostBookmark from "@/components/post/actions/PostBookmark";
import CommentBox from "@/app/(base-layout)/[userId]/[slug]/_components/CommentBox";
import QueryWrapper from "@/components/provider/QueryWrapper";
import CommentList from "@/app/(base-layout)/[userId]/[slug]/_components/CommentList";
import NextAuthProvider from "@/components/provider/NextAuthProvider";
import PostReactionButton from "@/components/reactions/actions/PostReactionButton";
import { PostShareButton } from "@/components/post/PostShareButton";
import { cn } from "@/utils/cn";
import tiptapExtensions from "@/utils/tiptapExt";
import PostList from "@/components/post/PostList";

export async function generateMetadata({
    params,
}: {
    params: { userId: string; slug: string };
}): Promise<Metadata> {
    const { userId, slug } = params;
    const post = await prisma.post.findUnique({
        where: {
            titleId: slug,
            published: true,
            OR: [
                {
                    userId: userId,
                },
                {
                    authorUsername: userId,
                },
            ],
        },
    });
    return {
        title: `${post?.title}`,
        description: post?.description,
        openGraph: { images: [post?.coverImage as string] },
        authors: [{ name: post?.author }],
    };
}

export default async function PostPage({
    params,
}: {
    params: { userId: string; slug: string };
}) {
    const prose =
        "min-h-screen prose prose-sm sm:prose lg:prose-lg mx-auto mt-12 mb-12 mr-4 ml-4 sm:mr-auto sm:ml-auto max-w-md focus:outline-none";
    const { slug, userId } = params;
    const post = await prisma.post.findUnique({
        where: {
            titleId: slug,
            published: true,
            OR: [
                {
                    userId: userId,
                },
                {
                    authorUsername: userId,
                },
            ],
        },
        include: {
            _count: {
                select: {
                    reactions: true,
                    comments: true,
                },
            },
            organization: {
                select: {
                    name: true,
                    image: true,
                },
            },
            series: true,
        },
    });
    if (!post) return notFound();

    const session = await getServerSession(authConfig);
    const isPublisher = (await session?.user.id) === post.userId;

    const user = await prisma.user.findUnique({
        where: { id: session?.user.id ?? "" },
    });

    const extensions = tiptapExtensions();

    const postContent = generateHTML(post?.content as JSONContent, extensions);
    return (
        <PostSlugWatcher postId={post.id}>
            <main className={prose}>
                {isPublisher && (
                    <div className="flex justify-end">
                        <Link
                            href={`/${user?.username || user?.id}/${
                                post.titleId
                            }/edit`}
                            className="text-sm"
                        >
                            Edit
                        </Link>
                        <div className="divider divider-horizontal"></div>
                        <Link href={"/manage"} className="text-sm">
                            Manage
                        </Link>
                    </div>
                )}
                {post.series.length !== 0 && (
                    <p className="text-sm">
                        This is a part of the following series: &nbsp;
                        {post.series.map((series, index) => (
                            <Fragment key={series.id}>
                                {post.series.length !== index + 1 ? (
                                    <strong>
                                        <Link
                                            href={`/${userId}/series/${series.id}`}
                                        >
                                            {series.title}
                                        </Link>
                                        , and{" "}
                                    </strong>
                                ) : (
                                    <strong>
                                        <Link
                                            href={`/${userId}/series/${series.id}`}
                                        >
                                            {series.title}
                                        </Link>
                                    </strong>
                                )}
                            </Fragment>
                        ))}
                    </p>
                )}
                <Image
                    src={post?.coverImage as string}
                    height={1920}
                    width={1080}
                    alt={`cover image for ${post.title} `}
                />
                <div className="lg:-space-y-6 -space-y-4">
                    <h1>{post?.title}</h1>
                    <h4 className="!text-slate-600">{post?.description}</h4>
                    <br />
                    {post.tags.length !== 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {post.tags.map((tag: string, index: number) => (
                                <Fragment key={index}>
                                    <Link href={`/tag/${tag}`}>
                                        <p className="text-sm">#{tag}</p>
                                    </Link>
                                </Fragment>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2 items-center not-prose !mt-1 !mb-2">
                        {/* <div className="avatar">
                            <div className="rounded-full">
                                <Image
                                    src={post.authorImage}
                                    alt={post.author}
                                    className="rounded-full"
                                    width={40}
                                    height={40}
                                />
                            </div>
                        </div> */}
                        <div className="flex flex-row-reverse items-center gap-1 relative">
                            <div
                                className={cn("avatar", {
                                    "absolute top-6 left-[25px] z-10":
                                        post.organizationId,
                                })}
                            >
                                <div className="w-7 rounded-full">
                                    <Image
                                        src={post.authorImage}
                                        alt={post.author}
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </div>
                            {post.organizationId && post.organization && (
                                <div className="avatar">
                                    <div className="w-12 rounded">
                                        <Image
                                            src={
                                                post.organization
                                                    .image as string
                                            }
                                            alt={
                                                post.organization.name as string
                                            }
                                            width={64}
                                            height={64}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="container">
                            <p className="text-sm">
                                <strong>
                                    <Link
                                        href={`/${
                                            post.authorUsername
                                                ? post.authorUsername
                                                : post?.userId
                                        }`}
                                    >
                                        {post?.author}
                                    </Link>
                                </strong>{" "}
                                {post.organization && (
                                    <span>
                                        for{" "}
                                        <strong>
                                            {post.organization.name}
                                        </strong>
                                    </span>
                                )}{" "}
                                · {post?.readPerMinute} min read
                            </p>
                            {new Date(post.updatedAt).toDateString() ===
                            new Date(post.createdAt).toDateString() ? (
                                <p className=" text-xs">
                                    Posted on{" "}
                                    {new Date(
                                        post.createdAt,
                                    ).toLocaleDateString(undefined, {
                                        month: "short",
                                        year:
                                            new Date().getFullYear() ===
                                            new Date(
                                                post.createdAt,
                                            ).getFullYear()
                                                ? undefined
                                                : "numeric",
                                        day: "numeric",
                                    })}
                                </p>
                            ) : (
                                <p className=" text-xs">
                                    Updated at{" "}
                                    {new Date(
                                        post.updatedAt,
                                    ).toLocaleDateString(undefined, {
                                        month: "short",
                                        year:
                                            new Date().getFullYear() ===
                                            new Date(
                                                post.createdAt,
                                            ).getFullYear()
                                                ? undefined
                                                : "numeric",
                                        day: "numeric",
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="container p-2">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <PostReactionButton
                                        authorId={post.userId}
                                        session={session}
                                        id={post.id}
                                        initialReactionCount={
                                            post._count.reactions
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        icon={
                                            post._count.comments !== 0
                                                ? faComment
                                                : faRegComment
                                        }
                                        title="Comments"
                                    />
                                    <div>{post._count.comments}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <PostBookmark titleId={post.titleId} />
                            <PostShareButton userId={userId} titleId={slug} />
                            {/* <FontAwesomeIcon icon={faEllipsis} title="More" /> */}
                        </div>
                    </div>
                </div>
                <article>{parse(`${postContent}`)}</article>
                <div className="divider divider-vertical"></div>
                <div className="not-prose">
                    <h2 className="text-3xl font-bold mb-8">Comments</h2>
                    <NextAuthProvider>
                        <CommentBox
                            titleId={slug}
                            title={post.title}
                            authorId={post.userId}
                            postId={post.id}
                            className="mb-4"
                        />
                        <QueryWrapper>
                            <CommentList {...post} />
                        </QueryWrapper>
                    </NextAuthProvider>
                </div>
            </main>
            <section className="lg:max-w-[70vw] lg:mx-auto ml-4 mr-4">
                <div className="divider divider-vertical"></div>
                <h3 className="text-2xl font-bold mb-8">Read Next</h3>
                <QueryWrapper>
                    <PostList postId={post.id} isHideFeedOpts={true} />
                </QueryWrapper>
            </section>
        </PostSlugWatcher>
    );
}
