'use client'

import { TagRank } from "@/types/tag";
import { getTagRankings } from "@/utils/actions/tag";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TagsRanking } from "@prisma/client";
import { Fragment, useEffect, useState } from "react";

export default function TagRankingMenu() {
    const [tagsRanking, setTagsRanking] = useState<TagsRanking | null>()

    useEffect(() => {
        getTagRankings().then(response => setTagsRanking(response))
    }, [])

    return (<>
        <div className="flex items-center space-x-1 mb-4">
            <h3 className="text-lg">Trending tags</h3>
            <FontAwesomeIcon icon={faFire} />
        </div>
        <ul className="space-y-2 text-sm">
            {tagsRanking && (tagsRanking.data as TagRank[]).map((tag: TagRank, index) => (
                <Fragment key={index}>
                    <li>#{tag.tag}</li>
                </Fragment>
            ))}
        </ul></>)
}