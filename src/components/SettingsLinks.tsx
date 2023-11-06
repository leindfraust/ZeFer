'use client'

import { usePathname } from "next/navigation"

export default function SettingsLinks() {
    const pathName = usePathname()
    function activeLink(link: string) {
        if (pathName.includes(link)) return 'active'
    }
    return (<ul className="menu menu-lg rounded-box">
        <li><a className={activeLink('profile')}>Profile</a></li>
        <li><a className={activeLink('preferences')}>Preferences</a></li>
        <li><a className={activeLink('account')}>Account</a></li>
        {/* <li><a>My Posts</a></li> */}
    </ul>)
}