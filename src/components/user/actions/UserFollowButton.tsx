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
    return (<button className={`btn ${userFollowStatus ? 'btn-primary' : 'btn-outline'}`} onClick={updateFollowUserStatus}>{userFollowStatus ? 'Following' : 'Follow'}</button>)
}