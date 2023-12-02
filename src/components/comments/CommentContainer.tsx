"use client";

import { CommentReaction, PostComment } from "@prisma/client";
import CharacterCount from "@tiptap/extension-character-count";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Youtube from "@tiptap/extension-youtube";
import HighLight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { generateHTML, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import parse from "html-react-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import CommentBox from "./CommentBox";
import useSocket from "@/socket";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import CommentReactionButton from "../reactions/actions/CommentReactionButton";
import { useSession } from "next-auth/react";

export default function CommentContainer({
    id,
    userId,
    userName,
    userUsername,
    userImage,
    content,
    createdAt,
    titleId,
    reactions,
}: PostComment & { titleId: string; reactions?: CommentReaction[] }) {
    const { data: session, status } = useSession();
    const socket = useSocket();

    const [commentBoxDisplay, setCommentBoxDisplay] = useState<boolean>(false);
    const prose = "prose prose-sm sm:prose lg:prose-lg";
    const postCommentContent = generateHTML(content as JSONContent, [
        TaskList,
        TaskItem,
        HighLight,
        StarterKit,
        TiptapImage,
        TiptapLink,
        Youtube,
        CharacterCount,
    ]);

    const getReplyComments = async () => {
        const params = new URLSearchParams({
            commentId: id,
        });
        const response = await fetch(`/api/comment/reply?${params}`);
        const data = await response.json();
        return data.data as PostComment[];
    };

    const { data, refetch } = useQuery({
        queryKey: ["replyComments", id],
        queryFn: getReplyComments,
    });

    useEffect(() => {
        socket.on("refetchReplies", () => {
            setCommentBoxDisplay(false);
            refetch();
        });

        return () => {
            socket.off("refetchReplies");
        };
    }, [id, refetch, socket]);

    return (
        <div className="container space-x-6">
            <div className="flex gap-2 items-start">
                <div className="avatar">
                    <div className="rounded-full prose-img:w-full !overflow-visible">
                        <Link href={`/${userUsername ?? userId}`}>
                            <Image
                                src={userImage}
                                alt={userName}
                                className="rounded-full"
                                width={40}
                                height={40}
                            />
                        </Link>
                    </div>
                </div>
                <div className="container">
                    <div className="shadow-md rounded-box border-solid border-2 focus-within:border-slate-500 p-4">
                        <div className={prose}>
                            <div className="flex items-center gap-2 mb-4">
                                <Link href={`/${userUsername ?? userId}`}>
                                    <p className="text-sm font-bold">
                                        {userName}
                                    </p>
                                </Link>
                                <p className="text-xs">
                                    {new Date(createdAt).toDateString()}
                                </p>
                            </div>
                            {parse(`${postCommentContent}`)}
                        </div>
                    </div>
                    {!commentBoxDisplay && (
                        <div className="flex justify-start gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <CommentReactionButton
                                    id={id}
                                    initialReactionCount={
                                        reactions?.length ?? 0
                                    }
                                    isLoggedIn={
                                        session && status === "authenticated"
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    className="cursor-pointer"
                                    icon={faComment}
                                    onClick={() => setCommentBoxDisplay(true)}
                                />
                                <p className="text-sm">{data?.length}</p>
                            </div>
                        </div>
                    )}
                    <CommentBox
                        titleId={titleId}
                        commentReplyPostId={id}
                        className={`mt-4 ${
                            commentBoxDisplay ? "block" : "hidden"
                        }`}
                        buttonChildren={
                            <button
                                className="btn btn-info btn-outline"
                                onClick={() => setCommentBoxDisplay(false)}
                            >
                                Cancel
                            </button>
                        }
                    />
                </div>
            </div>
            <div className="mt-4 mb-4">
                {data?.length !== 0 &&
                    data?.map((reply) => (
                        <Fragment key={reply.id}>
                            <CommentContainer {...reply} titleId={titleId} />
                        </Fragment>
                    ))}
            </div>
        </div>
    );
}
