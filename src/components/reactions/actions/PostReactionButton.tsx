"use client";

import {
    getInitialPostReaction,
    deletePostReaction,
    updateCreatePostReaction,
} from "@/utils/actions/reactions";
import { checkUserLoggedIn } from "@/utils/actions/user";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function PostReactionButton({
    id,
    initialReactionCount,
}: {
    id: string;
    initialReactionCount: number;
}) {
    const [postReactionCount, setPostReactionCount] =
        useState<number>(initialReactionCount);
    const [postReaction, setPostReaction] = useState<string>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    //get initial post reaction
    useEffect(() => {
        checkUserLoggedIn().then((response) =>
            setIsLoggedIn(response.valueOf())
        );
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            getInitialPostReaction(id).then((response) => {
                const value = response?.valueOf();

                if (typeof value !== "boolean") {
                    setPostReaction(value);
                }
            });
        }
    }, [id, isLoggedIn]);

    async function updatePostReaction() {
        if (typeof postReaction !== "undefined") {
            const removePostReaction = await deletePostReaction(id);
            if (removePostReaction) {
                setPostReaction(undefined);
                setPostReactionCount((prev) => prev - 1);
            }
        } else {
            const addOrEditPostReaction = await updateCreatePostReaction(
                id,
                "heart"
            );
            if (addOrEditPostReaction) {
                setPostReaction("heart");
                setPostReactionCount((prev) => prev + 1);
            }
        }
    }
    return (
        <>
            {isLoggedIn ? (
                <>
                    <FontAwesomeIcon
                        icon={faHeart}
                        title="Reactions"
                        className="cursor-pointer"
                        onClick={updatePostReaction}
                    />
                    <div>{postReactionCount}</div>
                </>
            ) : (
                <>
                    <FontAwesomeIcon
                        icon={faHeart}
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
