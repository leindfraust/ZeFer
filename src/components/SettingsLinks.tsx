'use client'

import { usePathname } from "next/navigation"
import { useState } from "react"

export default function SettingsLinks() {
    const pathName = usePathname()
    const extractedPath = pathName.substring(pathName.lastIndexOf('/') + 1)
    const [selectedLink, setSelectedLink] = useState<string>(extractedPath)

    function selectLink(e: React.ChangeEvent<HTMLSelectElement>) {
        if (extractedPath === e.currentTarget.value) setSelectedLink(e.currentTarget.value)
    }

    function activeLink(link: string) {
        if (extractedPath === link) return 'active'
    }

    return (<>
        <ul className="hidden lg:block menu menu-lg rounded-box">
            <li><a className={activeLink('profile')}>Profile</a></li>
            <li><a className={activeLink('preferences')}>Preferences</a></li>
            <li><a className={activeLink('account')}>Account</a></li>
        </ul>
        <select className="select select-bordered font-bold text-lg w-full max-w-xs lg:hidden" value={selectedLink} onChange={selectLink}>
            <option value='profile'>Profile</option>
            <option value='preferences'>Preferences</option>
            <option value='account'>Account</option>
        </select>
    </>)
}