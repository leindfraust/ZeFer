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
import {
    faComment,
    faTrash,
    faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState, useRef } from "react";
import CommentBox from "./CommentBox";
import useSocket from "@/socket";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import CommentReactionButton from "../../../../../components/reactions/actions/CommentReactionButton";
import { useSession } from "next-auth/react";
import { isCommentOwner } from "@/utils/actions/comments";
import { deleteComments } from "@/utils/actions/comments";
import Modal from "@/components/ui/Modal";
export default function CommentContainer({
    id,
    userId,
    userName,
    userUsername,
    userImage,
    content,
    createdAt,
    titleId,
    title,
    reactions,
    isRemoved,
}: PostComment & {
    titleId: string;
    title: string;
    reactions?: CommentReaction[];
}) {
    const { data: session, status } = useSession();
    const socket = useSocket();
    const [commentBoxDisplay, setCommentBoxDisplay] = useState<boolean>(false);
    const [isCommentDelete, setCommentDelete] = useState<boolean>(false);
    const modalDeleteRef = useRef<HTMLDialogElement>(null);
    const [ownComment, setOwnComment] = useState<string>();
    const [ownPost, setOwnPost] = useState<string>();
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
        const getOwnerComment = async () => {
            const { commentOwner, postOwner } = await isCommentOwner(
                session?.user.id,
                titleId,
            );
            setOwnComment(commentOwner);
            setOwnPost(postOwner);
        };
        getOwnerComment();

        return () => {
            socket.off("refetchReplies");
        };
    }, [id, refetch, socket, session?.user.id, titleId]);

    const deleteCommentBtn = async (id: string) => {
        const data = await deleteComments(id);
        setCommentDelete(data);
    };
    return (
        <div className="container space-x-6">
            <div className="flex gap-2 items-start">
                <div className="avatar">
                    <div className="rounded-full prose-img:w-full !overflow-visible">
                        <Link href={`/${userUsername ?? userId}`}>
                            {isCommentDelete || isRemoved ? (
                                <FontAwesomeIcon
                                    icon={faUserSlash}
                                    className="rounded-full"
                                    width={40}
                                    height={40}
                                />
                            ) : (
                                <Image
                                    src={userImage}
                                    alt={userName}
                                    className="rounded-full"
                                    width={40}
                                    height={40}
                                />
                            )}
                        </Link>
                    </div>
                </div>

                <div className="container">
                    <div className="shadow-md rounded-box border-solid border-2 focus-within:border-slate-500 p-4 mb-4">
                        <div className={prose}>
                            {isCommentDelete || isRemoved ? (
                                <div className="flex items-center gap-4">
                                    <p>Comment deleted by user</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Link
                                            href={`/${userUsername ?? userId}`}
                                        >
                                            <p className="text-sm font-bold">
                                                {userName}
                                            </p>
                                        </Link>
                                        <p className="text-xs">
                                            {new Date(createdAt).toDateString()}
                                        </p>
                                    </div>
                                    {parse(`${postCommentContent}`)}
                                </>
                            )}
                        </div>
                    </div>
                    {commentBoxDisplay ||
                    isCommentDelete ||
                    isRemoved ? null : (
                        <div className="flex justify-start gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <CommentReactionButton
                                    id={id}
                                    userId={userId}
                                    session={session}
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
                            {ownComment === userId || ownPost ? (
                                <div className="flex items-center ml-auto px-4">
                                    <FontAwesomeIcon
                                        className="cursor-pointer"
                                        icon={faTrash}
                                        onClick={() =>
                                            modalDeleteRef.current?.show()
                                        }
                                    />
                                </div>
                            ) : null}
                        </div>
                    )}
                    <Modal ref={modalDeleteRef}>
                        <div className="flex flex-col space-y-4">
                            <h1 className="font-bold text-lg tracking-tighter">
                                Delete Comment
                            </h1>
                            <p className="text-md">
                                Are you sure you want to delete this comment?
                                This action cannot be undone.
                            </p>
                            <div className="modal-action">
                                <form method="dialog">
                                    <div className="flex justify-center gap-4">
                                        <button
                                            className="btn btn-error"
                                            onClick={() => deleteCommentBtn(id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                modalDeleteRef.current?.close();
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal>
                    <CommentBox
                        titleId={titleId}
                        commentReplyPostId={id}
                        commentReplyPostTitle={title}
                        commentReplyUserId={userId}
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
                            <CommentContainer
                                {...reply}
                                titleId={titleId}
                                title={title}
                            />
                        </Fragment>
                    ))}
            </div>
        </div>
    );
}
