"use client";

import {
    getInitialCommentReaction,
    deleteCommentReaction,
    updateCreateCommentReaction,
} from "@/utils/actions/reactions";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as FaRegHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { UserNotificationInputValidation } from "@/types/notification";
import useSocket from "@/socket";

export default function CommentReactionButton({
    id,
    userId,
    session,
    initialReactionCount,
    isLoggedIn,
}: {
    id: string;
    userId: string;
    session: Session | null;
    initialReactionCount: number;
    isLoggedIn: boolean;
}) {
    const socket = useSocket();
    const pathname = usePathname();
    const [commentReactionCount, setCommentReactionCount] =
        useState<number>(initialReactionCount);
    const [commentReaction, setCommentReaction] = useState<string>();

    useEffect(() => {
        if (isLoggedIn) {
            getInitialCommentReaction(id).then((response) => {
                const value = response?.valueOf();

                if (typeof value !== "boolean") {
                    setCommentReaction(value);
                }
            });
        }
    }, [id, isLoggedIn]);

    async function updateCommentReaction() {
        if (typeof commentReaction !== "undefined") {
            const removeCommentReaction = await deleteCommentReaction(id);
            if (removeCommentReaction) {
                setCommentReaction(undefined);
                setCommentReactionCount((prev) => prev - 1);
            }
        } else {
            const addOrEditCommentReaction = await updateCreateCommentReaction(
                id,
                "heart",
            );
            if (addOrEditCommentReaction) {
                setCommentReaction("heart");
                setCommentReactionCount((prev) => prev + 1);
                const reactionNotification: UserNotificationInputValidation = {
                    userId: userId,
                    postId: id,
                    fromUserId: session?.user.id,
                    from: session?.user.name,
                    fromImage: session?.user.image,
                    message: `has reacted with ❤️ to your comment on your post`,
                    actionUrl: pathname,
                };
                socket.emit("submitNotification", reactionNotification);
            }
        }
    }
    return (
        <>
            {isLoggedIn ? (
                <>
                    <FontAwesomeIcon
                        icon={
                            commentReaction !== undefined ? faHeart : FaRegHeart
                        }
                        title="Reactions"
                        className="cursor-pointer"
                        onClick={updateCommentReaction}
                    />
                    <div>{commentReactionCount}</div>
                </>
            ) : (
                <>
                    <FontAwesomeIcon
                        icon={
                            commentReaction !== undefined ? faHeart : FaRegHeart
                        }
                        title="Reactions"
                        className="cursor-pointer"
                        onClick={() => signIn()}
                    />
                    <div>{commentReactionCount}</div>
                </>
            )}
        </>
    );
}
