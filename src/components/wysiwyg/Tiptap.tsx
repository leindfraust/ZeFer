'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import HighLight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import CharacterCount from '@tiptap/extension-character-count'
import NextImage from 'next/image'
import MenuBar from './menu/MenuBar'
import parse from 'html-react-parser'
import { useState } from 'react'
import { StatusResponse } from '@/types/status'
import StautsNotif from '../StatusNotif'
import { useRouter } from 'next/navigation'

export default function Tiptap() {
    const router = useRouter()
    const [blogError, setBlogError] = useState<StatusResponse>()
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [coverImage, setCoverImage] = useState<string>('')
    const [coverImageFile, setCoverImageFile] = useState<File>()
    const [preview, setPreview] = useState<boolean>(false)
    const [publishState, setPublishState] = useState<boolean>(false)

    function PreviewEditor() {
        const renderHtml = editor?.getHTML() as string
        return (<section className="min-h-screen prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto mt-12 mb-12 mr-12 ml-12 sm:mr-auto sm:ml-auto max-w-md focus:outline-none">
            <NextImage src={coverImage as string} height={1920} width={1080} alt="cover" />
            <div className="container -space-y-6">
                <h1>{title}</h1>
                <h4>{description}</h4>
            </div>
            <p><strong>[Your Name]</strong> · [number] min read</p>
            <div className="divider divider-vertical"></div>
            {parse(`${renderHtml}`)}
        </section>
        )
    }

    const editor = useEditor({
        extensions: [
            HighLight,
            TaskItem,
            TaskList,
            TiptapImage.configure({
                HTMLAttributes: {
                    class: 'mx-auto'
                }
            }),
            TiptapLink.extend({
                inclusive: false
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: 'mx-auto'
                }
            }),
            CharacterCount,
            StarterKit,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'min-h-[70vh] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto mt-12 mb-12 mr-12 ml-12 sm:mr-auto sm:ml-auto focus:outline-none'
            }
        }
    })

    function addCoverImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return
        if (event.target.files[0]) {
            setCoverImage(URL.createObjectURL(event.target.files[0]))
            setCoverImageFile(event.target.files[0])
        }
    }

    function modalCoverImage(event: React.MouseEvent<HTMLLabelElement>) {
        if (coverImage) {
            event.preventDefault()
            const modal = document.getElementById('cover_image') as HTMLDialogElement
            modal.show()
        }
    }

    function togglePreview() {
        setPreview(() => !preview)
    }

    async function uploadBlog(publish: boolean) {
        setPublishState(true)
        const json = editor?.getJSON()
        const editorImages = json?.content?.filter(image => image.type === 'image')
        const images = async () => {
            let images: File[] = []
            if (editorImages) {
                for (const [index, image] of Object.entries(editorImages)) {
                    const fetchImg = await fetch(image?.attrs?.src).then(file => file.blob()).then(blob => new File([blob], `img_${index}`, { type: "image/png" }));
                    images.push(fetchImg);
                }
            }
            return images
        }
        const readPerMinute = Math.round(editor?.storage.characterCount.words() / 238)
        const formData = new FormData()
        formData.append("coverImage", coverImageFile as File)
        if ((await images()).length !== 0) {
            formData.append("image_total", Object.keys(await images()).length as unknown as string)
            for (const [index, image] of Object.entries(await images())) {
                formData.append(`image_${index}`, image)
            }
        }
        formData.append("title", title)
        formData.append("description", description)
        formData.append("content", JSON.stringify(json))
        formData.append("series", "test")
        formData.append("readPerMinute", readPerMinute as unknown as string)
        formData.append("published", publish as unknown as string)

        const passedRequirements = await checkBlogRequirements()
        if (passedRequirements) {
            const uploadBlog = await fetch('/api/blog', {
                method: 'POST',
                body: formData
            })
            if (!uploadBlog.ok) {
                setBlogError({
                    ok: uploadBlog.ok,
                    status: uploadBlog.status,
                    statusText: uploadBlog.statusText,
                    message: 'Something went wrong, please try again later.'
                })
            } else {
                router.push('/blog/success')
            }
        }
        setPublishState(() => false)

    }

    async function checkBlogRequirements() {
        const wordsRequired = editor?.storage.characterCount.words() >= 500
        const required: { [key: string]: boolean } = {
            title: !!title,
            description: !!description,
            coverImage: !!coverImage,
            wordsRequired: !!wordsRequired
        };

        let requiredItems = []

        for (const key in required) {
            if (required.hasOwnProperty(key)) {
                const value = required[key];
                if (!value) {
                    requiredItems.push(key)
                }
            }
        }
        if (Object.keys(requiredItems).length !== 0) {
            setBlogError({
                ok: false,
                status: 499,
                statusText: 'Required Fields',
                message: requiredItems.filter(item => item !== 'wordsRequired').length !== 0 ? `The following fields: ${requiredItems.filter(item => item !== 'wordsRequired')} cannot be blank.` : !wordsRequired ? 'Insufficient words, need a minimum of 500 words to publish.' : ''
            })
            return false
        }
        return true

    }

    return (<>
        <StautsNotif {...blogError as StatusResponse} />
        <div className="flex flex-wrap  overflow-auto justify-center p-4">
            <form className="flex items-center justify-start mb-4 md:mb-0 md:flex-nowrap flex-wrap">
                <input
                    type="text"
                    placeholder="Add a meaningful title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-ghost w-full max-w-sm input-lg"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a brief description"
                    className="input input-ghost w-full max-w-md input-lg"
                />
            </form>
            <div className="flex items-center justify-end space-x-4 ml-4">
                <label htmlFor='coverImage' className={`btn ${coverImage ? 'btn-info' : ''}`} onClick={modalCoverImage}>{coverImage ? 'View Cover Image' : 'Add Cover Image'}</label>
                <input
                    type="file"
                    id='coverImage'
                    accept='image/png, image/jpeg'
                    onChange={addCoverImage}
                    hidden
                />
                <button className={`btn ${preview ? 'btn-info' : ''}`} onClick={togglePreview}>{preview ? 'Edit' : 'Preview'}</button>
                <button className="btn" onClick={() => uploadBlog(false)}>Save as Draft</button>
                <button className={`btn btn-success ${publishState ? 'btn-disabled' : ''}`} onClick={() => uploadBlog(true)}>{publishState ? 'Publishing...' : 'Publish'}</button>
            </div>
        </div>

        {coverImage ? (
            <dialog id="cover_image" className="modal">
                <div className="modal-box overflow-auto space-y-4">
                    <NextImage className='mx-auto' src={coverImage as string} alt='image' width={400} height={400} />
                    <label htmlFor='coverImage' className='btn btn-neutral flex justify-center align-middle'>Change</label>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        ) : null}


        {preview ? (<>
            <PreviewEditor />
        </>) : (
            <>
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
            </>
        )}
    </>)
}