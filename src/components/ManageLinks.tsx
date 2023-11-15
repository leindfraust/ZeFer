'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function ManageLinks() {
    const router = useRouter()
    const pathName = usePathname()
    const extractedPath = pathName.substring(pathName.lastIndexOf('/') + 1);
    const [selectedLink, setSelectedLink] = useState<string>(extractedPath)

    function selectLink(e: React.ChangeEvent<HTMLSelectElement>) {
        if (extractedPath !== e.currentTarget.value) router.push(`/manage/${e.currentTarget.value}`)
    }

    useEffect(() => {
        if (extractedPath) setSelectedLink(extractedPath)
    }, [extractedPath])

    function activeLink(link: string) {
        if (extractedPath === link) return 'active'
    }

    return (<>
        <ul className="hidden lg:block menu menu-lg rounded-box">
            <li><Link href={'/manage/posts'} className={activeLink('posts')}>Posts</Link></li>
            <li><Link href={'/manage/series'} className={activeLink('series')}>Series</Link></li>
            <li><Link href={'/manage/following'} className={activeLink('following')}>Following</Link></li>
            <li><Link href={'/manage/organization'} className={activeLink('organization')}>Organization</Link></li>
        </ul>
        <select className="select select-bordered font-bold text-lg w-full max-w-xs lg:hidden" value={selectedLink} onChange={selectLink}>
            <option value='posts'>Posts</option>
            <option value='series'>Series</option>
            <option value='following'>Following</option>
            <option value='organization'>Organization</option>
        </select>
    </>)
}