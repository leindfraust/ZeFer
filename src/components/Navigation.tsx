'use client'

import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { User } from '@prisma/client';


export default function Navigation({ name, image, id, username }: User) {
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
        <div className="navbar bg-base-200 sticky top-0 z-20">
            <div className="flex-1">
                <Link href={'/'} className="btn btn-ghost normal-case text-xl">ZeFer</Link>
                <div className="form-control hidden lg:block">
                    <div className="input-group">
                        <input type="text" placeholder="Search…" className="input input-bordered" onKeyDown={(e) => e.key === 'Enter' && searchKeywordFn()} onChange={(e) => setSearchKeyword(e.currentTarget.value)} value={searchKeyword} />
                        <button className="btn btn-neutral" onClick={searchKeywordFn}>
                            <FontAwesomeIcon icon={faSearch} size='lg' />
                        </button>
                    </div>
                </div>
            </div>
            {name && image && id ? (
                <div className="flex-none">
                    <div className="dropdown dropdown-end mr-2">
                        <ThemeSwitcher />
                    </div>
                    <div className="dropdown dropdown-end mr-2">
                        <Link href={'/new'}>
                            <label tabIndex={0} className='btn btn-primary'>
                                Create Post
                            </label>
                        </Link>
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <Image src={image as string} alt={name as string} width={50} height={50} />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link href={`/${username ?? id}`} className='!block justify-between'>
                                    <p className='text-lg font-bold'>{name}</p>
                                    {username && (<p className='text-slate-400'>@{username}</p>)}
                                </Link>
                            </li>
                            <li>
                                <Link href={'/manage'}>
                                    Manage Posts
                                </Link>
                            </li>
                            <li>
                                <Link href={'/settings'}>
                                    Settings
                                </Link>
                            </li>
                            <li><a onClick={() => signOut()}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <button className="btn btn-primary" onClick={() => signIn()}>Login</button>
                    </div>
                </div>
            )}
        </div>
    </>)
}