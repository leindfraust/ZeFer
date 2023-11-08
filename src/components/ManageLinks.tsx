'use client'

import { usePathname } from "next/navigation"
import { useState } from "react"

export default function ManageLinks() {
    const pathName = usePathname()
    const extractedPath = pathName.substring(pathName.lastIndexOf('/') + 1);
    const [selectedLink, setSelectedLink] = useState<string>(extractedPath)

    function selectLink(e: React.ChangeEvent<HTMLSelectElement>) {
        if (extractedPath === e.currentTarget.value) setSelectedLink(e.currentTarget.value)
    }

    function activeLink(link: string) {
        if (extractedPath === link) return 'active'
    }

    return (<>
        <ul className="hidden lg:block menu menu-lg rounded-box">
            <li><a className={activeLink('posts')}>Posts</a></li>
            <li><a className={activeLink('series')}>Series</a></li>
            <li><a className={activeLink('following')}>Following</a></li>
            <li><a className={activeLink('organization')}>Organization</a></li>
        </ul>
        <select className="select select-bordered font-bold text-lg w-full max-w-xs lg:hidden" value={selectedLink} onChange={selectLink}>
            <option value='posts'>Posts</option>
            <option value='series'>Series</option>
            <option value='following'>Following</option>
            <option value='organization'>Organization</option>
        </select>
    </>)
}