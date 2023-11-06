'use client'

import './custom_css/placeholder.css'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import HighLight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '../wysiwyg/custom_extensions/Image'
import TiptapLink from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import CharacterCount from '@tiptap/extension-character-count'
import NextImage from 'next/image'
import MenuBar from './menu/MenuBar'
import parse from 'html-react-parser'
import { Fragment, useEffect, useRef, useState } from 'react'
import { StatusResponse } from '@/types/status'
import StautsNotif from '../StatusNotif'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PostEdit } from '@/types/post'
import { PostDraft } from '@prisma/client'

export default function Tiptap({ userId, username, tags, postEdit, postDraft }: { userId?: string, username?: string | null | undefined, tags: string[], postEdit?: PostEdit, postDraft?: PostDraft }) {
    const editOrDraft = postEdit ?? postDraft
    const router = useRouter()
    const [postError, setPostError] = useState<StatusResponse>()
    const [coverImage, setCoverImage] = useState<string>(editOrDraft?.coverImage ?? '')
    const [coverImageFile, setCoverImageFile] = useState<File>()
    const [preview, setPreview] = useState<boolean>(false)
    const [publishState, setPublishState] = useState<boolean>(false)
    const [searchTag, setSearchTag] = useState<string>('')
    const [inputTags, setInputTags] = useState<string[]>(editOrDraft?.tags ?? [])
    const [tagList, setTagList] = useState<string[]>([...tags])

    const modal_coverImage = useRef<HTMLDialogElement>(null)
    const modal_tag = useRef<HTMLDialogElement>(null)

    const prose = 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto mt-12 mb-12 mr-4 ml-4 sm:mr-auto sm:ml-auto max-w-md focus:outline-none'


    function PreviewEditor() {
        const renderHtml = editor?.getHTML() as string
        return (<section className={prose}>

            {coverImage && (<NextImage src={coverImage as string} height={1920} width={1080} alt="cover" />)}

            <div className="container -space-y-6">
                <h1>{editorTitle?.getText()}</h1>
                <h4 className='!text-slate-600'>{editorDescription?.getText()}</h4>
                <br />
            </div>
            <p><strong>[Your Name]</strong> · [number] min read</p>
            <p className=" text-xs">Posted on {new Date().toDateString()}</p>
            {inputTags.length !== 0 && (
                <div className="flex space-x-4">
                    {inputTags.map((tag: string, index: number) => (
                        <Fragment key={index}>
                            <Link href="/"><p className='text-sm'>#{tag}</p></Link>
                        </Fragment>
                    ))}
                </div>
            )}
            <div className="divider divider-vertical"></div>
            {parse(`${renderHtml}`)}
        </section>
        )
    }

    const editor = useEditor({
        extensions: [
            Placeholder,
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
        content: editOrDraft?.content as JSONContent ?? '',
        editorProps: {
            attributes: {
                class: prose
            }
        }
    })

    const editorTitle = useEditor({
        extensions: [
            Placeholder.configure({
                placeholder: 'Your title here'
            }),
            StarterKit
        ],
        content: `<h1>${editOrDraft?.title ?? ''}</h1>`,
        editorProps: {
            attributes: {
                class: prose
            }
        }
    })

    const editorDescription = useEditor({
        extensions: [
            Placeholder.configure({
                placeholder: 'A discerning description'
            }),
            StarterKit
        ],
        content: `<h4>${editOrDraft?.description ?? ''}</h4>`,
        editorProps: {
            attributes: {
                class: prose
            }
        }
    })

    useEffect(() => {
        if (editorTitle?.isEmpty || editorDescription?.isEmpty) {
            editorTitle?.commands.setHeading({ level: 1 })
            editorDescription?.commands.setHeading({ level: 4 })
        }
    })

    useEffect(() => {
        let updateTimeout: NodeJS.Timeout | undefined
        const savePostDraft = async () => {
            const formData = new FormData
            const json = editor?.getJSON()
            const editorImages = json?.content?.filter(image => image.type === 'image')

            const images = async () => {
                let images: File[] = []
                if (editorImages) {
                    //fetch all images in the editor and turn them into a File given the name of img_index with a type of image/png and push them into an array of File
                    for (const [index, image] of Object.entries(editorImages)) {
                        const fetchImg = await fetch(image?.attrs?.src).then(file => file.blob()).then(blob => new File([blob], `img_${index}`, { type: "image/png" }));
                        images.push(fetchImg);
                    }
                }
                return images
            }
            if (coverImageFile) {
                formData.append("coverImage", coverImageFile as File)
            } else {
                const draftImg = await fetch(postDraft?.coverImage as string).then(file => file.blob()).then(blob => new File([blob], 'img_cover', { type: "image/png" }));
                formData.append("coverImage", draftImg)
            }
            if ((await images()).length !== 0) {
                // append a form data of image_total given the total length of the array
                formData.append("image_total", Object.keys(await images()).length as unknown as string)
                // iterate over the images and append them with their respective index and the image File itself
                for (const [index, image] of Object.entries(await images())) {
                    formData.append(`image_${index}`, image)
                }
            }
            formData.append("title", editorTitle?.getText() as string)
            formData.append("description", editorDescription?.getText() as string)
            formData.append("content", JSON.stringify(json))
            formData.append("tags", JSON.stringify(inputTags))
            const uploadDraft = await fetch('/api/post/draft', {
                method: 'POST',
                body: formData
            })
            if (!uploadDraft.ok) {
                setPostError({
                    ok: uploadDraft.ok,
                    status: uploadDraft.status,
                    statusText: uploadDraft.statusText,
                    message: 'Something went wrong, please try again later.'
                })
            }
            updateTimeout = undefined
        }
        const editorsUpdating = () => {
            if (!postEdit) {
                if (editorTitle?.getText() || editorDescription?.getText() || editor?.getText()) {
                    if (!updateTimeout || updateTimeout === undefined) {
                        updateTimeout = setTimeout(() => savePostDraft(), 5000)
                    } else {
                        clearTimeout(updateTimeout)
                        updateTimeout = setTimeout(() => savePostDraft(), 5000)
                    }
                }
            }
        }
        if (coverImageFile) {
            editorsUpdating()
        }
        if (inputTags) {
            editorsUpdating()
        }
        editorTitle?.on('update', () => {
            editorsUpdating()
        });
        editorDescription?.on('update', () => {
            editorsUpdating()
        });
        editor?.on('update', () => {
            editorsUpdating()
        });
    }, [postDraft?.coverImage, postEdit, coverImageFile, editor, editorDescription, editorTitle, inputTags])

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
            modal_coverImage.current?.show()
        }
    }

    function addTag(tag: string) {
        setInputTags([...inputTags, tag])
        setTagList([...tagList.filter(tagName => tagName !== tag)])
        const elem = document.activeElement as HTMLElement;
        elem?.blur();
    }

    function removeTag(tag: string) {
        setTagList([...tagList, tag])
        setInputTags(() => [...inputTags.filter(tagName => tagName !== tag)])
    }

    function togglePreview() {
        setPreview(() => !preview)
    }

    async function uploadPost(publish: boolean) {
        setPublishState(true)
        const json = editor?.getJSON()
        const editorImages = json?.content?.filter(image => image.type === 'image')
        const images = async () => {
            let images: File[] = []
            if (editorImages) {
                //fetch all images in the editor and turn them into a File given the name of img_index with a type of image/png and push them into an array of File
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
            // append a form data of image_total given the total length of the array
            formData.append("image_total", Object.keys(await images()).length as unknown as string)
            // iterate over the images and append them with their respective index and the image File itself
            for (const [index, image] of Object.entries(await images())) {
                formData.append(`image_${index}`, image)
            }
        }
        if (postEdit?.postId) {
            formData.append("postId", postEdit.postId)
        }
        formData.append("username", username ? username : '')
        formData.append("title", editorTitle?.getText() as string)
        formData.append("description", editorDescription?.getText() as string)
        formData.append("content", JSON.stringify(json))
        formData.append("series", "test")
        formData.append("tags", JSON.stringify(inputTags))
        formData.append("readPerMinute", readPerMinute as unknown as string)
        formData.append("published", publish as unknown as string)

        const passedRequirements = await checkPostRequirements()
        if (passedRequirements) {
            const uploadPost = await fetch('/api/post', {
                method: 'POST',
                body: formData
            })
            if (!uploadPost.ok) {
                setPostError({
                    ok: uploadPost.ok,
                    status: uploadPost.status,
                    statusText: uploadPost.statusText,
                    message: 'Something went wrong, please try again later.'
                })
            } else {
                uploadPost.json().then(response => {
                    router.push(`/${username ?? userId}/${response.data}`)
                })
            }
        }
        setPublishState(() => false)

    }

    async function checkPostRequirements() {
        const wordsRequired = editor?.storage.characterCount.words() >= 50
        const required: { [key: string]: boolean } = {
            title: !!editorTitle?.getText(),
            description: !!editorDescription?.getText(),
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
            setPostError({
                ok: false,
                status: 499,
                statusText: 'Required Fields',
                message: requiredItems.filter(item => item !== 'wordsRequired').length !== 0 ? `The following fields: ${requiredItems.filter(item => item !== 'wordsRequired')} cannot be blank.` : !wordsRequired ? 'Insufficient words, need a minimum of 50 words to publish.' : ''
            })
            return false
        }
        return true

    }

    return (<>
        <StautsNotif {...postError as StatusResponse} />
        {preview ? (<>
            <PreviewEditor />
        </>) : (
            <>
                <EditorContent editor={editorTitle} />
                <EditorContent editor={editorDescription} />
                <MenuBar editor={editor} />
                <EditorContent editor={editor} className='mb-24' />
            </>
        )}
        <div className=' fixed bottom-0 bg-base-200 w-screen rounded-lg bg-opacity-50 hover:bg-opacity-100'>
            <div className="flex flex-wrap justify-center p-2">
                <div className="flex items-center overflow-auto space-x-4">
                    <button className='btn btn-info' onClick={() => modal_tag.current?.showModal()}>Add tags</button>
                    <label htmlFor='coverImage' className={`btn ${coverImage ? 'btn-info' : ''}`} onClick={modalCoverImage}>{coverImage ? 'View Cover Image' : 'Add Cover Image'}</label>
                    <input
                        type="file"
                        id='coverImage'
                        accept='image/png, image/jpeg'
                        onChange={addCoverImage}
                        hidden
                    />
                    <button className={`btn ${preview ? 'btn-info' : ''}`} onClick={togglePreview}>{preview ? 'Edit' : 'Preview'}</button>
                    <button className="btn" onClick={() => uploadPost(false)}>Save as Draft</button>
                    <button className={`btn btn-success ${publishState ? 'btn-disabled' : ''}`} onClick={() => uploadPost(true)}>{publishState ? postEdit ? 'Updating' : 'Publishing...' : postEdit ? 'Update' : 'Publish'}</button>
                </div>
            </div>


            {coverImage && (<dialog ref={modal_coverImage} className="modal">
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
            </dialog>)}

            <dialog ref={modal_tag} className="modal">
                <div className="modal-box overflow-auto space-y-4">
                    <div className='flex justify-center'>
                        <div className="dropdown">
                            <input type='text' placeholder='Add tags' onChange={(e) => setSearchTag(e.currentTarget.value)} className="input max-w-sm input-ghost" />
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                {tagList.length !== 0 && tagList.filter(tag => tag.toLowerCase().includes(searchTag.toLowerCase())).sort().map((tag: string, index: number) => (
                                    <Fragment key={index}>
                                        <li onClick={() => addTag(tag)}><a>{tag}</a></li>
                                    </Fragment>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='flex flex-wrap'>
                        {inputTags && inputTags.map((tag: string, index: number) => (
                            <Fragment key={index}>
                                <div className='flex flex-wrap items-center -space-x-2'>
                                    <p className='text-lg rounded p-4 link-primary'>#{tag}</p>
                                    <p className='text-red-400 cursor-pointer' onClick={() => removeTag(tag)}>x</p>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    </>)
}