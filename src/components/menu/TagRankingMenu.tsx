"use client";

import { TagRank } from "@/types/tag";
import { getTagRankings } from "@/utils/actions/tag";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TagsRanking } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

export default function TagRankingMenu() {
    const [tagsRanking, setTagsRanking] = useState<
        TagsRanking[] | JsonValue[]
    >();

    useEffect(() => {
        getTagRankings().then((response) => setTagsRanking(response));
    }, []);

    return (
        <>
            <div className="flex items-center space-x-1 mb-4">
                <h3 className="text-lg">Trending tags</h3>
                <FontAwesomeIcon icon={faFire} />
            </div>
            <ul className="space-y-2 text-sm font-bold">
                {tagsRanking &&
                    (tagsRanking as TagRank[]).map((tag: TagRank, index) => (
                        <Fragment key={index}>
                            {index <= 9 && (
                                <li>
                                    <Link href={`/tag/${tag.tag}`}>
                                        #{tag.tag}
                                    </Link>
                                </li>
                            )}
                        </Fragment>
                    ))}
            </ul>
        </>
    );
}
