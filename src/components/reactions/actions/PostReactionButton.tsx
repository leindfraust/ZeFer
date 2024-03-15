"use client";

import {
    getUserInitialPostReaction,
    deletePostReaction,
    updateCreatePostReaction,
} from "@/utils/actions/reactions";
import { checkUserLoggedIn } from "@/utils/actions/user";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as FaRegHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { UserNotificationInputValidation } from "@/types/notification";
import useSocket from "@/socket";

export default function PostReactionButton({
    authorId,
    session,
    id,
    initialReactionCount,
}: {
    authorId: string;
    session: Session | null;
    id: string;
    initialReactionCount: number;
}) {
    const socket = useSocket();
    const pathname = usePathname();
    const [postReactionCount, setPostReactionCount] =
        useState<number>(initialReactionCount);
    const [postReaction, setPostReaction] = useState<string>();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    //get initial post reaction
    useEffect(() => {
        checkUserLoggedIn().then((response) =>
            setIsLoggedIn(response.valueOf()),
        );
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            getUserInitialPostReaction(id).then((response) => {
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
                "heart",
            );
            if (addOrEditPostReaction) {
                setPostReaction("heart");
                setPostReactionCount((prev) => prev + 1);
                const reactionNotification: UserNotificationInputValidation = {
                    userId: authorId,
                    from: session?.user.name,
                    fromImage: session?.user.image,
                    message: `has reacted with ❤️ to your post`,
                    postId: id,
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
                        icon={postReaction !== undefined ? faHeart : FaRegHeart}
                        title="Reactions"
                        className="cursor-pointer"
                        onClick={updatePostReaction}
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
