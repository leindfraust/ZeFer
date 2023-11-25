import type { MenuItemProps } from "@/types/menu";
import type { EditorContentProps } from "@tiptap/react";
import {
    faBold,
    faItalic,
    faStrikethrough,
    faCode,
    faMarker,
    faHeading,
    faListUl,
    faListOl,
    faListCheck,
    faFileCode,
    faQuoteLeft,
    faRulerHorizontal,
    faLink,
    faImage,
    faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import MenuItems from "./MenuItems";
import { Fragment, useState, useRef } from "react";
import { cn } from "@/utils/cn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type MenuBarProps = React.ButtonHTMLAttributes<HTMLDivElement>;

export default function MenuBar({
    asComment,
    editor,
    className,
}: EditorContentProps & MenuBarProps & { asComment?: true }) {
    const [insertedLink, setInsertedLink] = useState<string>("");
    const link_modal = useRef<HTMLDialogElement>(null);

    function insertImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        if (event.target.files[0]) {
            const image = URL.createObjectURL(event.target.files[0]);
            editor
                ?.chain()
                .focus()
                .setImage({ src: image as string })
                .run();
        }
    }

    function promptLinkModal() {
        const prevLink = editor?.getAttributes("link").href;
        if (prevLink) {
            return editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .unsetLink()
                .run();
        }
        return link_modal.current?.show();
    }

    function insertLink() {
        if (!insertedLink) return;
        if (insertedLink === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run();
        }
        editor
            ?.chain()
            .focus()
            .extendMarkRange("link")
            .setLink({
                href:
                    insertedLink.includes("http://") ||
                    insertedLink.includes("https://")
                        ? insertedLink
                        : (`https://${insertedLink}` as string),
                target: "_blank",
            })
            .run();
        link_modal.current?.close();
    }

    const items: MenuItemProps[] = [
        {
            icon: faBold,
            title: "Bold",
            action: () => editor?.chain().focus().toggleBold().run(),
            isActive: () => editor?.isActive("bold"),
            type: "onDisplay",
        },
        {
            icon: faHeading,
            title: "Heading 1",
            action: () =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor?.isActive("heading", { level: 2 }),
            type: "onDisplay",
        },
        {
            icon: faItalic,
            title: "Italic",
            action: () => editor?.chain().focus().toggleItalic().run(),
            isActive: () => editor?.isActive("italic"),
            type: "onDisplay",
        },
        {
            icon: faStrikethrough,
            title: "Strike",
            action: () => editor?.chain().focus().toggleStrike().run(),
            isActive: () => editor?.isActive("strike"),
            type: "onDisplay",
        },
        {
            icon: faLink,
            title: "Link",
            action: () => promptLinkModal(),
            type: "onDisplay",
        },
        {
            icon: faMarker,
            title: "Highlight",
            action: () => editor?.chain().focus().toggleHighlight().run(),
            isActive: () => editor?.isActive("highlight"),
            type: "onDisplay",
        },
        {
            icon: faListUl,
            title: "Bullet List",
            action: () => editor?.chain().focus().toggleBulletList().run(),
            isActive: () => editor?.isActive("bulletList"),
            type: "onDisplay",
        },
        {
            icon: faListOl,
            title: "Ordered List",
            action: () => editor?.chain().focus().toggleOrderedList().run(),
            isActive: () => editor?.isActive("orderedList"),
            type: "onDisplay",
        },
        {
            icon: faListCheck,
            title: "Task List",
            action: () => editor?.chain().focus().toggleTaskList().run(),
            isActive: () => editor?.isActive("taskList"),
            type: "onDisplay",
        },
        {
            icon: faCode,
            title: "Code",
            action: () => editor?.chain().focus().toggleCode().run(),
            isActive: () => editor?.isActive("code"),
            type: "onDropdown",
        },
        {
            icon: faFileCode,
            title: "Code Block",
            action: () => editor?.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor?.isActive("codeBlock"),
            type: "onDropdown",
        },
        {
            icon: faQuoteLeft,
            title: "Blockquote",
            action: () => editor?.chain().focus().toggleBlockquote().run(),
            isActive: () => editor?.isActive("blockquote"),
            type: "onDropdown",
        },
        {
            icon: faRulerHorizontal,
            title: "Horizontal Rule",
            action: () => editor?.chain().focus().setHorizontalRule().run(),
            type: "onDropdown",
        },
        {
            icon: faImage,
            title: "Insert Image",
            action: () => document.getElementById("insertImage")?.click(),
            type: "onDropdown",
        },
    ];

    return (
        <div className={cn("sticky top-0 z-10 bg-base-100", className)}>
            <dialog ref={link_modal} className="modal">
                <div className="modal-box">
                    <div className="flex justify-center flex-wrap space-y-4 p-4">
                        <input
                            type="text"
                            placeholder="URL..."
                            className="input input-bordered w-full max-w-xs"
                            onChange={(e) =>
                                setInsertedLink(e.currentTarget.value)
                            }
                            value={insertedLink}
                        />
                        <button className="btn" onClick={insertLink}>
                            Insert Link
                        </button>
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
                id="insertImage"
                accept="image/png, image/jpeg"
                onChange={insertImage}
                value={""}
                hidden
            />
            <div className="flex lg:justify-center">
                <div className="flex-1 items-center">
                    {items.map((item, index) => (
                        <Fragment key={index}>
                            {item.type === "onDisplay" && (
                                <MenuItems {...item} />
                            )}
                        </Fragment>
                    ))}
                </div>
                <div className="flex justify-end">
                    <div className="dropdown dropdown-bottom dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost">
                            <FontAwesomeIcon icon={faEllipsis} />
                        </label>
                        <div
                            tabIndex={0}
                            className="flex dropdown-content z-[1] shadow bg-base-100 rounded-sm"
                        >
                            {items.map((item, index) => (
                                <Fragment key={index}>
                                    {item.type === "onDropdown" && (
                                        <>
                                            {!(
                                                asComment &&
                                                item.icon === faImage
                                            ) && <MenuItems {...item} />}
                                        </>
                                    )}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
