"use client"
//not working

import useSWR from "swr"

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json());


export default function useTags(keyword?: string) {
    const params = new URLSearchParams({
        q: keyword ?? ''
    })
    const { data, error, isLoading } = useSWR(`/api/tag?${params}`, fetcher)
    return {
        tags: data,
        isLoading,
        error
    }
}