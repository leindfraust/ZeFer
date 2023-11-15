"use client"

import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const [searchKeyword, setSearchKeyword] = useState<string>(searchParams.get('q') ?? '')

    function searchKeywordFn() {
        if (searchKeyword) {
            if (pathName.includes('/search')) {
                router.replace(`${pathName}?q=${searchKeyword}`)
            } else {
                router.push(`/search/posts?q=${searchKeyword}`)
            }
        }
    }

    return (<>
        <div className="form-control">
            <div className="join">
                <input type="text" placeholder="Search…" className="input input-bordered w-10/12 join-item" onKeyDown={(e) => e.key === 'Enter' && searchKeywordFn()} onChange={(e) => setSearchKeyword(e.currentTarget.value)} value={searchKeyword} />
                <button className="btn btn-neutral join-item" onClick={searchKeywordFn}>
                    <FontAwesomeIcon icon={faSearch} size='lg' />
                </button>
            </div>
        </div></>)
}