"use client"

import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Post } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

export default function PostManageTable() {

    const pathName = usePathname()
    const searchParams = useSearchParams()
    const deleteModalWarnRef = useRef<HTMLDialogElement>(null)
    const [selectedPostIdDeletion, setSelectedPostIdDeletion] = useState<string>('')
    const [orderBy, setOrderBy] = useState<'recent' | 'unpublished' | 'most-views' | 'most-reactions' | 'most-comments'>(searchParams.get('sort') as 'recent' | 'unpublished' | 'most-views' | 'most-reactions' | 'most-comments')
    const { replace } = useRouter()

    const getPosts = async () => {
        const params = new URLSearchParams({
            sort: orderBy
        })
        const response = await fetch(`/api/post/manage?${params}`)
        const json = await response.json()
        const data = await json.data
        return data
    }

    function handleModalWarn(decision: 'delete' | 'cancel') {
        if (decision === 'delete') {
            mutationDeletePost.mutate()
        }
        if (decision === 'cancel') {
            setSelectedPostIdDeletion('')
        }
    }

    const deletePost = async () => {
        const params = new URLSearchParams({
            postId: selectedPostIdDeletion
        })
        const response = await fetch(`/api/post/manage?${params}`, {
            method: "DELETE"
        })
        const json = await response.json()
        if (json) setSelectedPostIdDeletion('')
        return json
    }

    const mutationDeletePost = useMutation({
        mutationFn: deletePost
    })

    const { data, refetch, isSuccess } = useQuery({
        queryKey: ['posts'],
        queryFn: getPosts
    })

    useEffect(() => {
        if (!orderBy) setOrderBy(searchParams.get('sort') as 'recent' | 'unpublished' | 'most-views' | 'most-reactions' | 'most-comments')
        replace(`${pathName}?sort=${orderBy ?? 'recent'}`, { scroll: false })
        if (mutationDeletePost.isSuccess) refetch()
        refetch()
    }, [mutationDeletePost.isSuccess, orderBy, pathName, refetch, replace, searchParams])

    return (<div className="container">
        <dialog className="modal" ref={deleteModalWarnRef}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Delete Post</h3>
                <p className="py-4">Are you sure you want to delete this post? This action cannot be undone.</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <div className="flex justify-center gap-4">
                            <button className="btn btn-error" onClick={() => handleModalWarn('delete')}>Delete</button>
                            <button className="btn" onClick={() => handleModalWarn('cancel')}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>


        <div className="flex justify-end">
            <select className=" select select-bordered" onChange={(e) => setOrderBy(e.target.value as 'recent' | 'unpublished' | 'most-views' | 'most-reactions' | 'most-comments')}>
                <option defaultValue='recent' value='recent'>Recent</option>
                <option value='unpublished'>Unpublished</option>
                <option value='most-views'>Most Views</option>
                <option value='most-reactions'>Most Reactions</option>
                <option value='most-comments'>Most Comments</option>
            </select>
        </div>
        <div className="overflow-x-auto">
            <table className="table table-lg">
                <tbody>
                    {isSuccess && data && data.map((post: Post) => (
                        <Fragment key={post.id}>

                            <tr>
                                <th className=" text-xl"><Link href={`/${post.authorUsername || post.userId}/${post.titleId}`}>{post.title}</Link></th>
                                <td><span className={post.published ? 'badge badge-neutral' : 'badge badge-warning'}>{post.published ? 'PUBLISHED' : 'UNPUBLISHED'}</span></td>
                                <td>
                                    <div className="flex justify-end items-center gap-4">
                                        <button className="btn btn-xs btn-outline btn-error" onClick={() => {
                                            deleteModalWarnRef.current?.show()
                                            setSelectedPostIdDeletion(post.id)
                                        }}>Delete</button>
                                        <Link href={`/${post.authorUsername || post.userId}/${post.titleId}/edit`} className="btn btn-xs btn-outline btn-primary">Edit</Link>
                                        <FontAwesomeIcon icon={faEllipsis} className="cursor-pointer" size="lg" />
                                    </div>
                                </td>
                            </tr>
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>)
}