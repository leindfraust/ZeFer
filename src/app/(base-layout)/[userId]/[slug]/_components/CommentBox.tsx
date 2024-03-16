"use client";

import MenuBar from "../../../../../components/wysiwyg/menu/MenuBar";
import "../../../../../components/wysiwyg/custom_css/placeholder.css";
import { EditorContent, useEditor } from "@tiptap/react";
import TiptapImage from "../../../../../components/wysiwyg/custom_extensions/Image";
import TiptapLink from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { cn } from "@/utils/cn";
import useSocket from "@/socket";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserNotificationInputValidation } from "@/types/notification";

type CommentBoxProps = React.HTMLAttributes<HTMLDivElement>;

export default function CommentBox({
    titleId,
    title,
    authorId,
    postId,
    buttonChildren,
    commentReplyPostTitle,
    commentReplyPostId,
    commentReplyUserId,
    className,
}: CommentBoxProps & {
    titleId: string;
    title?: string;
    authorId?: string;
    postId?: string;
    commentReplyPostTitle?: string; //only used in notifications
    commentReplyUserId?: string;
    commentReplyPostId?: string;
    buttonChildren?: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [submitState, setSubmitState] = useState<boolean>(false);
    const socket = useSocket();
    const editor = useEditor({
        extensions: [
            Placeholder.configure({
                placeholder: "Type something in here",
            }),
            Highlight,
            TaskItem,
            TaskList,
            TiptapImage.configure({
                HTMLAttributes: {
                    class: "mx-auto",
                },
            }),
            TiptapLink.extend({
                inclusive: false,
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: "mx-auto",
                },
            }),
            CharacterCount,
            StarterKit,
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto ml-2 mr-2 mt-2 outline-none h-40 overflow-auto",
            },
        },
    });

    useEffect(() => {
        socket.on("clearContentCommentBox", () => {
            editor?.commands.clearContent();
            setSubmitState(false);
        });

        return () => {
            socket.off("clearContentCommentBox");
        };
    }, [editor?.commands, socket, titleId]);

    function submitComment() {
        if (editor?.getText() && !editor.isEmpty) {
            const content = editor.getJSON();
            const comment = {
                titleId: titleId,
                userId: session?.user.id,
                content: JSON.stringify(content),
                commentReplyPostId: commentReplyPostId,
            };
            if (commentReplyPostId && commentReplyUserId) {
                const commentReplyNotification: UserNotificationInputValidation =
                    {
                        userId: commentReplyUserId,
                        fromUserId: session?.user.id,
                        from: session?.user.name,
                        fromImage: session?.user.image,
                        message: `has replied to your comment on ${commentReplyPostTitle}`,
                        actionUrl: pathname,
                    };
                socket.emit("submitNotification", commentReplyNotification);
            }
            if (authorId && title) {
                const commentNotification: UserNotificationInputValidation = {
                    userId: authorId,
                    fromUserId: session?.user.id,
                    from: session?.user.name,
                    fromImage: session?.user.image,
                    message: `has commented on your post`,
                    postId,
                    actionUrl: pathname,
                };
                socket.emit("submitNotification", commentNotification);
            }
            setSubmitState(true);
            socket.emit("submitComment", comment);
        }
    }

    return (
        <>
            {session?.user && status === "authenticated" && (
                <div className={cn("container", className)}>
                    <div className="flex gap-2 items-start">
                        <div className="avatar">
                            <div className="rounded-full prose-img:w-full !overflow-visible">
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name}
                                    className="rounded-full"
                                    width={40}
                                    height={40}
                                />
                            </div>
                        </div>
                        <div className="container">
                            <div className="shadow-md rounded-box border-solid border-2 focus-within:border-slate-500">
                                <EditorContent editor={editor} />
                                <MenuBar
                                    editor={editor}
                                    className="w-full"
                                    asComment={true}
                                />
                            </div>
                            <div className="flex justify-start gap-4 mt-4">
                                <button
                                    className="btn btn-outline"
                                    onClick={submitComment}
                                    disabled={submitState}
                                >
                                    {submitState && (
                                        <span className="loading loading-spinner"></span>
                                    )}
                                    {submitState ? "Submitting" : "Submit"}
                                </button>
                                {buttonChildren && <>{buttonChildren}</>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
