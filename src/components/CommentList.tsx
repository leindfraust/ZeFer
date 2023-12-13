"use client";

import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import CommentContainer from "./comments/CommentContainer";
import useSocket from "@/socket";
import { Post, PostComment } from "@prisma/client";
import QueryWrapper from "./QueryWrapper";

export default function CommentList({ titleId, title }: Post) {
    const socket = useSocket();
    const getComments = async () => {
        const params = new URLSearchParams({
            titleId: titleId,
        });
        const res = await fetch(`/api/comment?${params}`);
        const data = await res.json();
        return data.data as PostComment[];
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
                                        title={title}
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
