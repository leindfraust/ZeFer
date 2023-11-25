"use client";

import { getPostComments } from "@/utils/actions/comments";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import CommentContainer from "./comments/CommentContainer";
import useSocket from "@/socket";

export default function CommentList({ titleId }: { titleId: string }) {
    const socket = useSocket();
    const getComments = async () => {
        const data = await getPostComments(titleId);
        return data;
    };

    const { data, refetch } = useQuery({
        queryKey: ["comments"],
        queryFn: getComments,
    });

    useEffect(() => {
        socket.emit("initializeSocketPostRoom", titleId);
        socket?.on("refetchComments", (socketTitleId) => {
            if (socketTitleId === titleId) refetch();
        });
    }, [refetch, socket, titleId]);

    useEffect(() => {
        if (socket.disconnected) {
            socket.connect();
        }
    }, [socket]);

    return (
        <>
            <div className="space-y-4">
                {data &&
                    data.map((comment) => (
                        <Fragment key={comment.id}>
                            {!comment.postCommentReplyId && (
                                <CommentContainer
                                    {...comment}
                                    titleId={titleId}
                                />
                            )}
                        </Fragment>
                    ))}
            </div>
        </>
    );
}
