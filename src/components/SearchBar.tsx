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
            <div className="input-group">
                <input type="text" placeholder="Search…" className="input input-bordered" onKeyDown={(e) => e.key === 'Enter' && searchKeywordFn()} onChange={(e) => setSearchKeyword(e.currentTarget.value)} value={searchKeyword} />
                <button className="btn btn-neutral" onClick={searchKeywordFn}>
                    <FontAwesomeIcon icon={faSearch} size='lg' />
                </button>
            </div>
        </div></>)
}