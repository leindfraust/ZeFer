"use client"

import { FormContext } from "@/types/formContext"
import { Post, PostSeries } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Fragment, useEffect, useRef, useState } from "react"
import Input from "./Input"
import { FormProvider, useForm } from "react-hook-form"
import SeriesManagePostContainer from "./series/SeriesManagePostContainer"
import QueryWrapper from "./QueryWrapper"

interface PostSeriesWithPosts extends PostSeries {
    posts: Array<Post>
}

export default function SeriesManageContainer() {
    const modalSeries = useRef<HTMLDialogElement>(null)
    const modalWarnDeleteSeries = useRef<HTMLDialogElement>(null)
    const modalAddPostToSeries = useRef<HTMLDialogElement>(null)
    const modalRemovePostToSeries = useRef<HTMLDialogElement>(null)
    const [editingSeries, setEditingSeries] = useState<boolean>(false)
    const [actionSeriesId, setActionSeriesId] = useState<string>('')
    const [modalActionAddPostSeries, setModalActionAddPostSeries] = useState<PostSeries | undefined>()
    const [modalActionRemoveSeries, setModalActionRemovePostSeries] = useState<PostSeries | undefined>()

    const getSeries = async () => {
        const response = await fetch('/api/post/manage/series')
        const json = await response.json()
        const data = await json.data
        return data
    }

    const submissions = useForm()

    const seriesTitle_validation: FormContext = {
        name: 'Title',
        type: 'text',
        placeholder: 'Your series title',
        value: '',
        required: {
            value: true,
            message: 'This field is required'
        }
    }

    const seriesDescription_validation: FormContext = {
        name: 'Description',
        type: 'text',
        placeholder: 'A description of your series (OPTIONAL)',
        value: '',
        required: {
            value: false,
            message: 'This field is not required'
        }
    }

    const createSeries = submissions.handleSubmit(async data => {
        const formData = new FormData()
        formData.append('title', data.Title)
        formData.append('description', data.Description)
        const post = await fetch('/api/post/manage/series', {
            method: 'POST',
            body: formData
        })
        modalSeries.current?.close()
        return post
    })

    const editSeries = submissions.handleSubmit(async data => {
        const params = new URLSearchParams({
            seriesId: actionSeriesId,
        })
        const formData = new FormData()
        formData.append('title', data.Title)
        formData.append('description', data.Description)
        const post = await fetch(`/api/post/manage/series?${params}`, {
            method: 'PUT',
            body: formData
        })
        modalSeries.current?.close()
        return post
    })

    const deleteSeries = async () => {
        const params = new URLSearchParams({
            seriesId: actionSeriesId,
        })
        const response = await fetch(`/api/post/manage/series?${params}`, {
            method: 'DELETE'
        })
        const json = await response.json()
        const data = await json.data
        return data
    }

    function handleModalEditSeries(id: string, title: string, description?: string) {
        setEditingSeries(true)
        setActionSeriesId(id)
        submissions.setValue("Title", title)
        submissions.setValue("Description", description)
        modalSeries.current?.show()
    }

    useEffect(() => {
        if (modalActionAddPostSeries) {
            modalAddPostToSeries.current?.show()
        }
        if (modalActionRemoveSeries) {
            modalRemovePostToSeries.current?.show()
        }
    }, [modalActionAddPostSeries, modalActionRemoveSeries])


    const mutationCreateSeries = useMutation({
        mutationFn: () => createSeries()
    })

    const mutationEditSeries = useMutation({
        mutationFn: () => editSeries()
    })

    const mutationDeleteSeries = useMutation({
        mutationFn: () => deleteSeries()
    })

    const { data, isSuccess, isLoading, isRefetching, refetch } = useQuery({
        queryKey: ['series'],
        queryFn: getSeries
    })

    useEffect(() => {
        if (mutationCreateSeries.isSuccess) refetch()
        if (mutationEditSeries.isSuccess) refetch()
        if (mutationDeleteSeries.isSuccess) refetch()
    }, [mutationCreateSeries.isSuccess, mutationDeleteSeries.isSuccess, mutationEditSeries.isSuccess, refetch])

    return (<div className="container">

        <button className="btn btn-neutral btn-outline" onClick={() => modalSeries.current?.show()}>Create Series</button>
        <dialog className="modal" ref={modalSeries}>
            <div className="modal-box">
                {editingSeries && (<>
                    <button className="btn btn-outline btn-error" onClick={() => modalWarnDeleteSeries.current?.show()}>DELETE SERIES</button>
                    <dialog className="modal" ref={modalWarnDeleteSeries}>
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mt-4">DELETE SERIES</h3>
                            <p className="text-md">Are you sure you want to delete this Series?</p>
                            <div className="modal-action">
                                <form method="dialog">
                                    <div className="flex gap-4">
                                        <button className="btn btn-error" onClick={() => {
                                            modalSeries.current?.close()
                                            mutationDeleteSeries.mutate()
                                        }
                                        }>Delete</button>
                                        <button className="btn">Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </>)}
                <h3 className="font-bold text-lg mt-4">{editingSeries ? 'Editing Series' : 'Create a Series'}</h3>
                <FormProvider {...submissions}>
                    <Input {...seriesTitle_validation} />
                    <Input {...seriesDescription_validation} />
                </FormProvider>
                <div className="modal-action">
                    <button className="btn btn-info" onClick={() => editingSeries ? mutationEditSeries.mutate() : mutationCreateSeries.mutate()}>Submit</button>
                    <form method="dialog">
                        <button className="btn" onClick={() => {
                            setEditingSeries(false)
                            submissions.setValue("Title", "")
                            submissions.setValue("Description", "")
                        }}>Close</button>
                    </form>
                </div>
            </div>
        </dialog>

        <div className="flex flex-wrap gap-4 mt-4">
            {isSuccess && data && data.map((series: PostSeriesWithPosts) => (
                <Fragment key={series.id}>
                    <div className="flex flex-col gap-4 shadow-lg hover:outline outline-gray-400 rounded-lg ">
                        <div className="card card-compact w-96 bg-base-100 cursor-pointer" onClick={() => handleModalEditSeries(series.id, series.title, series.description ?? '')}>
                            <div className="card-body">
                                <div className="flex">
                                    <h2 className="card-title flex-1">{series.title}</h2>
                                    <p className="text-md text-right">{series.posts.length} Posts</p>
                                </div>
                                <p>{series.description}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 p-4">
                            <button className="btn btn-outline" onClick={() => setModalActionAddPostSeries(series)}>Add a Post</button>
                            <button className="btn btn-outline btn-error" onClick={() => setModalActionRemovePostSeries(series)}>Remove a Post</button>
                        </div>
                    </div>
                </Fragment>
            ))}
            {modalActionAddPostSeries && (
                <dialog className="modal" ref={modalAddPostToSeries}>
                    <div className="modal-box">
                        <h3 className="text-xl">Add a Post to <strong>{modalActionAddPostSeries.title}</strong></h3>
                        <QueryWrapper>
                            <SeriesManagePostContainer {...modalActionAddPostSeries} action="add" />
                        </QueryWrapper>
                        <div className="modal-action">
                            <form method="dialog">
                                <div className="flex gap-4">
                                    <button className="btn" onClick={() => {
                                        setModalActionAddPostSeries(undefined)
                                        refetch()
                                    }
                                    }>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </dialog>)}

            {modalActionRemoveSeries && (<dialog className="modal" ref={modalRemovePostToSeries}>
                <div className="modal-box">
                    <h3 className="text-xl">Remove a Post to <strong>{modalActionRemoveSeries.title}</strong></h3>
                    <QueryWrapper>
                        <SeriesManagePostContainer {...modalActionRemoveSeries} action="remove" />
                    </QueryWrapper>
                    <div className="modal-action">
                        <form method="dialog">
                            <div className="flex gap-4">
                                <button className="btn" onClick={() => {
                                    setModalActionRemovePostSeries(undefined)
                                    refetch()
                                }
                                }>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>)}

        </div>

        {data === undefined || (data as Array<typeof data>).length === 0 && !isLoading && !isRefetching && (<>
            <div className="container mt-4">
                <p className="text-xl font-bold">No results were found.</p>
            </div>
        </>)}
    </div>)
}