import type { MenuItemProps } from "@/types/menu"
import type { EditorContentProps } from "@tiptap/react"
import { faBold, faItalic, faStrikethrough, faCode, faMarker, faHeading, faParagraph, faListUl, faListOl, faListCheck, faFileCode, faQuoteLeft, faRulerHorizontal, faArrowDown, faArrowsSpin, faRotateLeft, faRotateRight, faLink, faImage } from "@fortawesome/free-solid-svg-icons"
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import MenuItems from "./MenuItems"
import { Fragment, useState, useRef } from "react"

export default function MenuBar({ editor }: EditorContentProps) {
    const [insertedLink, setInsertedLink] = useState<string>('')
    const [youtube, setYoutube] = useState<string>('')
    const link_modal = useRef<HTMLDialogElement>(null)
    const youtube_modal = useRef<HTMLDialogElement>(null)

    function insertImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return
        if (event.target.files[0]) {
            const image = URL.createObjectURL(event.target.files[0])
            editor?.chain().focus().setImage({ src: image as string }).run()
        }
    }

    function promptLinkModal() {
        const prevLink = editor?.getAttributes('link').href
        if (prevLink) {
            return editor.chain().focus().extendMarkRange('link').unsetLink().run()
        }
        return link_modal.current?.show()
    }

    function insertLink() {
        if (!insertedLink) return
        if (insertedLink === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
        }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: insertedLink.includes('http://') || insertedLink.includes('https://') ? insertedLink : `https://${insertedLink}` as string, target: '_blank' }).run()
        link_modal.current?.close()
    }

    function insertYoutube() {
        if (!youtube) return
        editor?.chain().focus().setYoutubeVideo({ src: youtube }).run()
        youtube_modal.current?.close()
    }

    const items: MenuItemProps[] = [
        {
            icon: faBold,
            title: 'Bold',
            action: () => editor?.chain().focus().toggleBold().run(),
            isActive: () => editor?.isActive('bold'),
        },
        {
            icon: faItalic,
            title: 'Italic',
            action: () => editor?.chain().focus().toggleItalic().run(),
            isActive: () => editor?.isActive('italic'),
        },
        {
            icon: faStrikethrough,
            title: 'Strike',
            action: () => editor?.chain().focus().toggleStrike().run(),
            isActive: () => editor?.isActive('strike'),
        },
        {
            icon: faLink,
            title: 'Link',
            action: () => promptLinkModal()
        },
        {
            icon: faCode,
            title: 'Code',
            action: () => editor?.chain().focus().toggleCode().run(),
            isActive: () => editor?.isActive('code'),
        },
        {
            icon: faMarker,
            title: 'Highlight',
            action: () => editor?.chain().focus().toggleHighlight().run(),
            isActive: () => editor?.isActive('highlight'),
        },
        {
            type: 'divider',
        },
        {
            icon: faHeading,
            title: 'Heading 1',
            action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor?.isActive('heading', { level: 2 }),
        },
        {
            icon: faParagraph,
            title: 'Paragraph',
            action: () => editor?.chain().focus().setParagraph().run(),
            isActive: () => editor?.isActive('paragraph'),
        },
        {
            icon: faListUl,
            title: 'Bullet List',
            action: () => editor?.chain().focus().toggleBulletList().run(),
            isActive: () => editor?.isActive('bulletList'),
        },
        {
            icon: faListOl,
            title: 'Ordered List',
            action: () => editor?.chain().focus().toggleOrderedList().run(),
            isActive: () => editor?.isActive('orderedList'),
        },
        {
            icon: faListCheck,
            title: 'Task List',
            action: () => editor?.chain().focus().toggleTaskList().run(),
            isActive: () => editor?.isActive('taskList'),
        },
        {
            icon: faFileCode,
            title: 'Code Block',
            action: () => editor?.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor?.isActive('codeBlock'),
        },
        {
            type: 'divider',
        },
        {
            icon: faQuoteLeft,
            title: 'Blockquote',
            action: () => editor?.chain().focus().toggleBlockquote().run(),
            isActive: () => editor?.isActive('blockquote'),
        },
        {
            icon: faRulerHorizontal,
            title: 'Horizontal Rule',
            action: () => editor?.chain().focus().setHorizontalRule().run(),
        },
        {
            type: 'divider',
        },
        {
            icon: faImage,
            title: 'Insert Image',
            action: () => document.getElementById('insertImage')?.click(),
        },
        {
            icon: faYoutube,
            title: 'Insert Youtube link',
            action: () => youtube_modal.current?.show()
        },
        {
            type: 'divider',
        },
        {
            icon: faArrowDown,
            title: 'Hard Break',
            action: () => editor?.chain().focus().setHardBreak().run(),
        },
        {
            icon: faArrowsSpin,
            title: 'Clear Format',
            action: () => editor?.chain().focus().clearNodes().unsetAllMarks()
                .run(),
        },
        {
            type: 'divider',
        },
        {
            icon: faRotateLeft,
            title: 'Undo',
            action: () => editor?.chain().focus().undo().run(),
        },
        {
            icon: faRotateRight,
            title: 'Redo',
            action: () => editor?.chain().focus().redo().run(),
        },
    ]

    return (
        <div className="flex xl:justify-center bg-base-200 overflow-auto p-2 ">
            <dialog ref={link_modal} className="modal">
                <div className="modal-box">
                    <div className="flex justify-center flex-wrap space-y-4 p-4">
                        <input type="text" placeholder="URL..." className="input input-bordered w-full max-w-xs" onChange={(e) => setInsertedLink(e.currentTarget.value)} value={insertedLink} />
                        <button className="btn" onClick={insertLink}>Insert Link</button>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog ref={youtube_modal} className="modal">
                <div className="modal-box">
                    <div className="flex justify-center flex-wrap space-y-4 p-4">
                        <input type="text" placeholder="URL..." className="input input-bordered w-full max-w-xs" onChange={(e) => setYoutube(e.currentTarget.value)} value={youtube} />
                        <button className="btn" onClick={insertYoutube}>Insert Youtube Link</button>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <input
                type="file"
                id='insertImage'
                accept='image/png, image/jpeg'
                onChange={insertImage}
                hidden
            />
            {items.map((item, index) => (
                <Fragment key={index}>
                    {item.type === 'divider' ? <div className="divider divider-horizontal" /> : <MenuItems {...item} />}
                </Fragment>
            ))}
        </div>

    )
}