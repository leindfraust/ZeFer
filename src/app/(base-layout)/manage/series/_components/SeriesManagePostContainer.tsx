"use client";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Post, PostSeries } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

export default function SeriesManagePostContainer({
    id,
    title,
    action,
}: PostSeries & { action: "add" | "remove" }) {
    const [postSearch, setPostSearch] = useState<string>("");

    const getPosts = async () => {
        const params = new URLSearchParams({
            action: action,
            seriesId: id,
            seriesTitle: title,
        });
        const response = await fetch(`/api/post/manage/series/post?${params}`);
        const json = await response.json();
        const data = await json.data;
        return data;
    };

    const addPostToSeries = async (postId: string) => {
        const params = new URLSearchParams({
            seriesId: id,
            postId: postId,
        });
        const response = await fetch(`/api/post/manage/series/post?${params}`, {
            method: "POST",
        });
        const json = await response.json();
        const data = await json.data;
        return data;
    };

    const deletePostToSeries = async (postId: string) => {
        const params = new URLSearchParams({
            seriesId: id,
            postId: postId,
        });
        const response = await fetch(`/api/post/manage/series/post?${params}`, {
            method: "DELETE",
        });
        const json = await response.json();
        const data = await json.data;
        return data;
    };

    const mutationAddPostToSeries = useMutation({
        mutationFn: ({ postId }: { postId: string }) => addPostToSeries(postId),
    });

    const mutationDeletePostToSeries = useMutation({
        mutationFn: ({ postId }: { postId: string }) =>
            deletePostToSeries(postId),
    });

    const { data, isSuccess, isLoading, isRefetching, refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
    });

    useEffect(() => {
        if (mutationAddPostToSeries.isSuccess) refetch();
        if (mutationDeletePostToSeries.isSuccess) refetch();
    }, [
        mutationAddPostToSeries.isSuccess,
        mutationDeletePostToSeries,
        refetch,
    ]);

    return (
        <>
            <div className="overflow-x-auto mt-4">
                <div className="join container">
                    <input
                        type="text"
                        placeholder="Search…"
                        className="input input-bordered w-full join-item"
                        value={postSearch}
                        onChange={(e) => setPostSearch(e.currentTarget.value)}
                    />
                    <button className="btn btn-neutral join-item">
                        <FontAwesomeIcon icon={faSearch} size="lg" />
                    </button>
                </div>
                <table className="table table-lg">
                    <tbody>
                        {isSuccess &&
                            data &&
                            data
                                .filter(
                                    (post: Post) =>
                                        post.title
                                            .toLowerCase()
                                            .includes(
                                                postSearch.toLowerCase()
                                            ) || post.id === postSearch
                                )
                                .map((post: Post) => (
                                    <Fragment key={post.id}>
                                        <tr>
                                            <th>
                                                <Link
                                                    href={`/${
                                                        post.authorUsername ||
                                                        post.userId
                                                    }/${post.titleId}`}
                                                >
                                                    {post.title}
                                                </Link>
                                            </th>
                                            <td>
                                                <span
                                                    className={
                                                        post.published
                                                            ? "badge badge-neutral"
                                                            : "badge badge-warning"
                                                    }
                                                >
                                                    {post.published
                                                        ? "PUBLISHED"
                                                        : "UNPUBLISHED"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex justify-end items-center gap-4">
                                                    {action === "add" ? (
                                                        <button
                                                            className="btn btn-xs btn-outline btn-info"
                                                            onClick={() =>
                                                                mutationAddPostToSeries.mutate(
                                                                    {
                                                                        postId: post.id,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            Add
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-xs btn-outline btn-error"
                                                            onClick={() =>
                                                                mutationDeletePostToSeries.mutate(
                                                                    {
                                                                        postId: post.id,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    </Fragment>
                                ))}
                    </tbody>
                </table>
                {data === undefined ||
                    ((data as Array<typeof data>).length === 0 &&
                        !isLoading &&
                        !isRefetching && (
                            <>
                                <div className="container">
                                    <p className="text-xl font-bold">
                                        No results were found.
                                    </p>
                                </div>
                            </>
                        ))}
            </div>
        </>
    );
}
