'use client'

import { usePathname } from "next/navigation"

export default function ManageLinks() {
    const pathName = usePathname()
    function activeLink(link: string) {
        if (pathName.includes(link)) return 'active'
    }
    return (<ul className="menu menu-lg rounded-box">
        <li><a className={activeLink('posts')}>Posts</a></li>
        <li><a className={activeLink('series')}>Series</a></li>
        <li><a className={activeLink('following')}>Following</a></li>
        <li><a className={activeLink('organization')}>Organization</a></li>
        {/* <li><a>My Posts</a></li> */}
    </ul>)
}