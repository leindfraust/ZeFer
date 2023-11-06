"use client"

import { checkUserLoggedIn } from "@/utils/actions/user";
import { checkBookmarkPostStatus, setBookmarkPost } from "@/utils/actions/post";
import { signIn } from "next-auth/react";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as FaRegBookmark } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import type { SizeProp } from "@fortawesome/fontawesome-svg-core";

export default function PostBookmark({ titleId, faSize }: { titleId: string, faSize: SizeProp }) {
    const [bookmarkStatus, setBookmarkStatus] = useState<boolean>()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    //get initial bookmark status
    useEffect(() => {
        checkUserLoggedIn().then(response => setIsLoggedIn(response.valueOf()))
        if (isLoggedIn) {
            checkBookmarkPostStatus(titleId).then(response => {
                const value = response?.valueOf()
                if (value === 'bookmarked') {
                    setBookmarkStatus(true)
                }
                if (value === 'unbookmarked') {
                    setBookmarkStatus(false)
                }
            })
        }
    }, [isLoggedIn, titleId])

    async function updateBookmarkStatus() {
        const response = await setBookmarkPost(titleId)
        if (response === 'bookmarked') {
            setBookmarkStatus(true)
        }
        if (response === 'unbookmarked') {
            setBookmarkStatus(false)
        }
    }
    return (<>
        {isLoggedIn ? (
            <button onClick={updateBookmarkStatus}><FontAwesomeIcon icon={!bookmarkStatus ? FaRegBookmark : faBookmark} size={faSize} width={20} /></button>
        ) : (
            <button onClick={() => signIn()}><FontAwesomeIcon icon={!bookmarkStatus ? FaRegBookmark : faBookmark} width={20} size={faSize} /></button>
        )}
    </>)
}

