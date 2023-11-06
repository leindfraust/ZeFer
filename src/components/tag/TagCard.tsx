"use client"

import { TagRank } from "@/types/tag";
import Link from "next/link";
import TagFollowButton from "./actions/TagFollowButton";

export default function TagCard({ tag, usage, followers, isLoggedIn }: TagRank & { isLoggedIn: boolean }) {
    return (
        <div className="container p-4 max-w-xs shadow-xl rounded-md">
            <div className="flex gap-4 items-center justify-center">
                <div className="break-words">
                    <Link href={`/tag/${tag}`}>
                        <h2 className="text-2xl font-bold">#{tag}</h2>
                    </Link>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-right">{usage} Posts</p>
                        <p className="text-sm text-right">{followers} Followers</p>
                    </div>
                </div>
                <TagFollowButton tag={tag} isLoggedIn={isLoggedIn} />
            </div>
        </div>
    )
}