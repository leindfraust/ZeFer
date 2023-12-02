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

export default function CommentReactionButton({
    id,
    initialReactionCount,
    isLoggedIn,
}: {
    id: string;
    initialReactionCount: number;
    isLoggedIn: boolean;
}) {
    const [postReactionCount, setCommentReactionCount] =
        useState<number>(initialReactionCount);
    const [postReaction, setCommentReaction] = useState<string>();

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
        if (typeof postReaction !== "undefined") {
            const removeCommentReaction = await deleteCommentReaction(id);
            if (removeCommentReaction) {
                setCommentReaction(undefined);
                setCommentReactionCount((prev) => prev - 1);
            }
        } else {
            const addOrEditCommentReaction = await updateCreateCommentReaction(
                id,
                "heart"
            );
            if (addOrEditCommentReaction) {
                setCommentReaction("heart");
                setCommentReactionCount((prev) => prev + 1);
            }
        }
    }
    return (
        <>
            {isLoggedIn ? (
                <>
                    <FontAwesomeIcon
                        icon={postReaction !== undefined ? faHeart : FaRegHeart}
                        title="Reactions"
                        className="cursor-pointer"
                        onClick={updateCommentReaction}
                    />
                    <div>{postReactionCount}</div>
                </>
            ) : (
                <>
                    <FontAwesomeIcon
                        icon={postReaction !== undefined ? faHeart : FaRegHeart}
                        title="Reactions"
                        className="cursor-pointer"
                        onClick={() => signIn()}
                    />
                    <div>{postReactionCount}</div>
                </>
            )}
        </>
    );
}
