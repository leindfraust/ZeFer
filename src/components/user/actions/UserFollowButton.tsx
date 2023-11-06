"use client"

import { toggleFollowUser } from "@/utils/actions/user";
import { useState } from "react";

export default function UserFollowButton({ userId, initialFollowStatus }: { userId: string, initialFollowStatus: boolean }) {
    const [userFollowStatus, setUserFollowStatus] = useState<boolean>(initialFollowStatus)

    async function updateFollowUserStatus() {
        const response = await toggleFollowUser(userId)
        if (response === 'following') {
            setUserFollowStatus(true)
        }
        if (response === 'unfollowing') {
            setUserFollowStatus(false)
        }
    }
    return (<>
        <div className="flex justify-center mt-2 lg:flex-none lg:mt-0">
            <button className={`lg:block lg:absolute top-5 right-5 btn ${userFollowStatus ? 'btn-primary' : 'btn-outline'}`} onClick={updateFollowUserStatus}>{userFollowStatus ? 'Following' : 'Follow'}</button>
        </div>
    </>)
}