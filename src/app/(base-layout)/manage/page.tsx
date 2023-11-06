"use client"

import { useRouter } from "next/navigation"


export default function Manage() {
    const router = useRouter()
    router.push('/manage/posts')
}