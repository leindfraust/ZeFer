'use client'

import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher';

type User = {
    name: String
    image: String
    id: String
}

export default function Navigation({ name, image, id }: User) {
    return (<>
        <div className="navbar bg-base-200 sticky top-0 z-20">
            <div className="flex-1">
                <Link href={'/'} className="btn btn-ghost normal-case text-xl">ZeFer</Link>
            </div>
            {name && image && id ? (
                <div className="flex-none">
                    <div className="dropdown dropdown-end mr-2">
                        <ThemeSwitcher />
                    </div>
                    <div className="dropdown dropdown-end mr-2">
                        <Link href={'/blog/new'}>
                            <label tabIndex={0} className='btn btn-primary'>
                                Create Blog
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
                                <Link href={`/user/${id}`} className="justify-between">
                                    Profile
                                </Link>
                            </li>
                            <li><a>Settings</a></li>
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