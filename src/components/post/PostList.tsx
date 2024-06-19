"use client";

import { Post } from "@prisma/client";
import { Fragment, useState } from "react";
import PostContainer from "./PostContainer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import PostContainerLoader from "./PostContainerLoader";

export default function PostList({
    keyword,
    tag,
    userId,
    published,
}: {
    keyword?: string;
    tag?: string;
    userId?: string;
    published?: boolean;
}) {
    const [refetchAllowed, setRefetchAllowed] = useState<boolean>(false);
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [feed, setFeed] = useState<"relevance" | "latest" | "most-popular">(
        searchParams.get("feed") as "relevance" | "latest" | "most-popular",
    );
    const { replace } = useRouter();

    const getPosts = async ({ cursor }: { cursor: string }) => {
        const params = new URLSearchParams({
            q: keyword ?? "",
            tag: tag ?? "",
            userId: userId ?? "",
            orderBy: feed ?? "relevance", //we set the default value to desc for our sorting so that is latest in our feed
            published: published ? published.toString() : "true", //we set the default value to true as to reduce the possibilities of showing unpublished blogs
            cursor: cursor,
        });
        const response = await fetch(`/api/post?${params}`);
        const json = await response.json();
        const data = await json.data;
        return data;
    };
    const { ref, inView } = useInView({
        threshold: 0,
    });

    const {
        data,
        // error,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isSuccess,
        refetch,
        isFetching,
        isRefetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        initialPageParam: "",
        queryKey: ["posts"],
        queryFn: ({ pageParam = "" }) =>
            getPosts({ cursor: pageParam as string }),
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => {
            return Object.keys(lastPage).length !== 0
                ? lastPage?.metaData.lastCursor
                : undefined;
        },
    });

    useEffect(() => {
        if (!feed)
            setFeed(
                searchParams.get("feed") as
                    | "relevance"
                    | "latest"
                    | "most-popular",
            );
        replace(
            `${pathName}?${keyword ? `q=${keyword}&` : ""}feed=${
                feed ?? "relevance"
            }`,
            { scroll: false },
        );
        if (refetchAllowed) refetch();
    }, [
        feed,
        keyword,
        pathName,
        refetch,
        refetchAllowed,
        replace,
        searchParams,
    ]);

    useEffect(() => {
        if (feed !== "relevance" && feed) setRefetchAllowed(true);
    }, [feed]);

    useEffect(() => {
        // if the last element is in view and there is a next page, fetch the next page
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, inView, isFetching]);

    return (
        <>
            {data?.pageParams.filter((param) => param !== "").length !== 0 && (
                <div
                    className={`flex items-center mb-6 ${
                        keyword ? "justify-end" : "justify-start"
                    } space-x-4`}
                >
                    <h3
                        className={`text-xl cursor-pointer hover:underline ${
                            feed === "relevance" ? "underline" : ""
                        }`}
                        onClick={() => setFeed("relevance")}
                    >
                        Relevant
                    </h3>
                    <h3
                        className={`text-xl cursor-pointer hover:underline ${
                            feed === "latest" ? "underline" : ""
                        }`}
                        onClick={() => setFeed("latest")}
                    >
                        Latest
                    </h3>
                    <h3
                        className={`text-xl cursor-pointer hover:underline ${
                            feed === "most-popular" ? "underline" : ""
                        }`}
                        onClick={() => setFeed("most-popular")}
                    >
                        Most Popular
                    </h3>
                </div>
            )}
            <div className="space-y-4">
                {isSuccess && !isLoading && !isRefetching ? (
                    data?.pages.map(
                        (page) =>
                            page.data &&
                            page.data.map(
                                (
                                    post: Post & {
                                        organization: {
                                            name: string;
                                            image: string;
                                        } | null;
                                    },
                                    index: string,
                                ) => (
                                    <Fragment key={post.id}>
                                        {page.data.length === index + 1 ? (
                                            <div ref={ref}>
                                                <PostContainer {...post} />
                                            </div>
                                        ) : (
                                            <div>
                                                <PostContainer {...post} />
                                            </div>
                                        )}
                                    </Fragment>
                                ),
                            ),
                    )
                ) : (
                    <PostContainerLoader />
                )}
                {isFetchingNextPage && <PostContainerLoader />}
                {keyword &&
                    data?.pageParams.filter((param) => param !== "").length ===
                        0 &&
                    !isLoading &&
                    !isFetching && (
                        <h3 className="text-xl">No results were found.</h3>
                    )}
                {data?.pageParams.filter((param) => param !== "").length !==
                    0 &&
                    !hasNextPage &&
                    !isLoading &&
                    !isFetching && (
                        <div className=" divider divider-vertical text-sm max-w-md mx-auto">
                            End of Results
                        </div>
                    )}
            </div>
        </>
    );
}
