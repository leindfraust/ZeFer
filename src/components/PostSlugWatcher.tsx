"use client"

import { addOrUpdateUserPostReadingHistory, addPostView } from "@/utils/actions/post";
import { useEffect, useRef } from "react";

export default function PostSlugWatcher({ children, postId }: { children: React.ReactNode, postId: string }) {
    const readTime = 1000
    const isViewCounted = useRef<boolean>(false)
    const isActivelyReading = useRef<boolean>(false)
    const readingTimeInterval = useRef<ReturnType<typeof setInterval>>()
    const readTimeCountdown = useRef<NodeJS.Timeout | undefined>()


    useEffect(() => {

        setTimeout(async () => {
            const addViewCount = await addPostView(postId)
            if (addViewCount) isViewCounted.current = true
        }, 15000)

        const addPostReadingLength = async () => {
            const response = await addOrUpdateUserPostReadingHistory(postId, readTime)
            if (!response) return
        }
        const userInactivityCountdown = () => {
            readTimeCountdown.current = setTimeout(() => {
                isActivelyReading.current = false
                clearInterval(readingTimeInterval.current)
                readingTimeInterval.current = undefined
            }, 30000)
        }
        const handleScroll = async () => {
            if (isViewCounted) {
                if (!readTimeCountdown.current || readTimeCountdown.current === undefined) {
                    isActivelyReading.current = true
                    userInactivityCountdown()
                } else {
                    clearTimeout(readTimeCountdown.current)
                    isActivelyReading.current = true
                    userInactivityCountdown()
                }
            }
            if (isActivelyReading.current) {
                if (!readingTimeInterval.current || readingTimeInterval === undefined) {
                    readingTimeInterval.current = setInterval(() => {
                        addPostReadingLength()
                    }, readTime)
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [postId]);

    return (
        <>
            {children}
        </>
    )
}