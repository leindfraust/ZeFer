"use client";

import { TagRank } from "@/types/tag";
import { Fragment, useEffect, useState } from "react";
import TagContainer from "./TagContainer";
import TagContainerLoader from "./TagContainerLoader";

export default function TagList({ keyword }: { keyword?: string }) {
    const [tags, setTags] = useState<TagRank[]>();
    const [fetchingTags, setFetchingTags] = useState<boolean>(true);

    useEffect(() => {
        async function getTags() {
            setFetchingTags(true);
            const params = new URLSearchParams({
                q: keyword ?? "",
            });
            const response = await fetch(`/api/tag/ranking?${params}`);
            const data = await response.json();
            setTags(await data);
            setFetchingTags(false);
        }
        getTags();
    }, [keyword]);

    return (
        <>
            <div className="flex flex-wrap max-w-xl gap-2">
                {tags?.length !== 0 &&
                    tags?.map((tag: TagRank, index: number) => (
                        <Fragment key={index}>
                            <TagContainer {...tag} />
                        </Fragment>
                    ))}
                {tags?.length === 0 && !fetchingTags && (
                    <h3 className="text-xl">No results were found.</h3>
                )}
                {fetchingTags && <TagContainerLoader />}
            </div>
        </>
    );
}
