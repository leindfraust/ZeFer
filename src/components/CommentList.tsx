"use client";

import { getPostComments } from "@/utils/actions/comments";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import CommentContainer from "./comments/CommentContainer";
import useSocket from "@/socket";
import QueryWrapper from "./QueryWrapper";

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
        socket.on("refetchComments", () => {
            refetch();
        });

        return () => {
            socket.off("refetchComments");
        };
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
                    data.length !== 0 &&
                    data.map((comment) => (
                        <Fragment key={comment.id}>
                            {!comment.postCommentReplyId && (
                                <QueryWrapper>
                                    <CommentContainer
                                        {...comment}
                                        titleId={titleId}
                                    />
                                </QueryWrapper>
                            )}
                        </Fragment>
                    ))}

                {data?.length === 0 && (
                    <p className="text-xl">No comments yet.</p>
                )}
            </div>
        </>
    );
}
