"use client";

import { User } from "@prisma/client";
import { Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
// import { useSearchParams, usePathname, useRouter } from "next/navigation";
import PeopleContainer from "./people/PeopleContainer";
import PeopleContainerLoader from "./people/PeopleContainerLoader";


export default function PeopleList({ keyword }: { keyword?: string }) {

    const getUsers = async ({ cursor }: { cursor: string }) => {
        const params = new URLSearchParams({
            q: keyword ?? '',
            cursor: cursor
        })
        const response = await fetch(`/api/user?${params}`)
        const json = await response.json()
        const data = await json.data
        return data
    }
    const { ref, inView } = useInView({
        threshold: 0
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
        initialPageParam: '',
        queryKey: ["users"],
        queryFn: ({ pageParam = "" }) => getUsers({ cursor: pageParam as string }),
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => {
            return Object.keys(lastPage).length !== 0 ? lastPage?.metaData.lastCursor : undefined;
        },
    });

    useEffect(() => {
        if (keyword) refetch()
    }, [refetch, keyword])

    useEffect(() => {
        // if the last element is in view and there is a next page, fetch the next page
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [hasNextPage, inView, fetchNextPage, refetch, isFetching]);

    return (<div className="space-y-6">
        {isSuccess && !isLoading && !isRefetching ? data?.pages.map(page =>
            page.data && page.data.map((user: User, index: string) => (
                <Fragment key={user.id}>
                    {page.data.length === index + 1 ? (
                        <div ref={ref}>
                            <PeopleContainer {...user} />
                        </div>
                    ) : (
                        <div>
                            <PeopleContainer {...user} />
                        </div>
                    )}
                </Fragment>
            ))) : (
            <PeopleContainerLoader />
        )}
        {isFetchingNextPage && (<PeopleContainerLoader />)}
        {keyword && data?.pageParams.filter(param => param !== '').length === 0 && !isLoading && !isFetching && (
            <h3 className="text-xl">No results were found.</h3>
        )}
        {data?.pageParams.filter(param => param !== '').length !== 0 && !hasNextPage && !isLoading && !isFetching && (
            <div className=" divider divider-vertical text-sm max-w-md mx-auto">End of Results</div>
        )}
    </div>)
}