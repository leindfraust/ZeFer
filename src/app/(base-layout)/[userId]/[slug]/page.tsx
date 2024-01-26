import prisma from "@/db";
import type { JSONContent } from "@tiptap/react";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HighLight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
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
        title: `${post?.title} - ZeFer`,
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
            series: true,
        },
    });
    if (!post) return notFound();

    const session = await getServerSession(authConfig);
    const isPublisher = (await session?.user.id) === post.userId;

    const user = await prisma.user.findUnique({
        where: { id: session?.user.id ?? "" },
    });

    const postContent = generateHTML(post?.content as JSONContent, [
        TaskList,
        TaskItem,
        HighLight,
        StarterKit,
        TiptapImage,
        TiptapLink,
        Youtube,
        CharacterCount,
    ]);
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

                    <div className="flex gap-2 items-center">
                        <div className="avatar">
                            <div className="rounded-full prose-img:w-full !overflow-visible">
                                <Image
                                    src={post.authorImage}
                                    alt={post.author}
                                    className="rounded-full"
                                    width={40}
                                    height={40}
                                />
                            </div>
                        </div>
                        <div className="-space-y-4">
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
                                        title={post.title}
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
                            className="mb-4"
                        />
                        <QueryWrapper>
                            <CommentList {...post} />
                        </QueryWrapper>
                    </NextAuthProvider>
                </div>
            </main>
        </PostSlugWatcher>
    );
}
