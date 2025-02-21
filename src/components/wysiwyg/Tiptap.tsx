"use client";

import "./custom_css/placeholder.css";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "../wysiwyg/custom_extensions/Image";
import TiptapLink from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import NextImage from "next/image";
import MenuBar from "./menu/MenuBar";
import parse from "html-react-parser";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { StatusResponse } from "@/types/status";
import StautsNotif from "../StatusNotif";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Organization, PostDraft } from "@prisma/client";
import { cn } from "@/utils/cn";
import { validateTag } from "@/utils/actions/tag";
import Modal from "../ui/Modal";
import { autocompleteGemini } from "@/utils/actions/wysiwyg";
import { AutocompleteGemini } from "./custom_extensions/autocomplete";
import tiptapExtensions from "@/utils/tiptapExt";

export default function Tiptap({
    userId,
    username,
    tags,
    editOrDraft,
    mode,
    selectedOrg,
}: {
    userId?: string;
    username?: string | null | undefined;
    tags: string[];
    editOrDraft?: PostDraft;
    mode?: "edit" | "draft";
    selectedOrg?: Organization | null;
}) {
    const router = useRouter();
    const [postError, setPostError] = useState<StatusResponse>();
    const [coverImage, setCoverImage] = useState<string>(
        editOrDraft?.coverImage ?? "",
    );
    const [coverImageFile, setCoverImageFile] = useState<File>();
    const [preview, setPreview] = useState<boolean>(false);
    const [publishState, setPublishState] = useState<boolean>(false);
    const [searchTag, setSearchTag] = useState<string>("");
    const [inputTags, setInputTags] = useState<string[]>(
        editOrDraft?.tags ?? [],
    );
    const [tagList, setTagList] = useState<string[]>(tags);
    const [isAutoSavingDraft, setIsAutoSavingDraft] = useState<boolean>(false);
    const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);

    useEffect(() => {
        if (editOrDraft?.tags) {
            function removeInputTags() {
                let tagList = tags;
                editOrDraft?.tags.forEach((tagDraft) => {
                    const tag = tagList.filter((tag) => tag !== tagDraft);
                    tagList = tag;
                });
                return tagList;
            }
            const newTagList = removeInputTags();
            setTagList(newTagList);
        }
    }, [editOrDraft?.tags, tags]);

    const modal_coverImage = useRef<HTMLDialogElement>(null);
    const [modalOpenState, setModalOpenState] = useState<boolean>(false);
    const [insertContentState, setInsertContentState] =
        useState<boolean>(false);

    const postDraftTimeout = useRef<NodeJS.Timeout>(undefined);
    const insertContentTimeout = useRef<NodeJS.Timeout>(undefined);

    const [tagValidateResult, setTagValidateResult] = useState<boolean>();

    const prose =
        "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto mt-8 mb-8 mr-4 ml-4 sm:mr-auto sm:ml-auto max-w-md focus:outline-none";

    function PreviewEditor() {
        const renderHtml = editor?.getHTML() as string;
        return (
            <section className={prose}>
                {coverImage && (
                    <NextImage
                        src={coverImage as string}
                        height={1920}
                        width={1080}
                        alt="cover"
                    />
                )}

                <div className="container -space-y-6">
                    <h1>{editorTitle?.getText()}</h1>
                    <h4 className="!text-slate-600">
                        {editorDescription?.getText()}
                    </h4>
                    <br />
                </div>
                <p>
                    <strong>[Your Name]</strong> · [number] min read
                </p>
                <p className=" text-xs">
                    Posted on {new Date().toDateString()}
                </p>
                {inputTags.length !== 0 && (
                    <div className="flex space-x-4">
                        {inputTags.map((tag: string, index: number) => (
                            <Fragment key={index}>
                                <Link href="/">
                                    <p className="text-sm">#{tag}</p>
                                </Link>
                            </Fragment>
                        ))}
                    </div>
                )}
                <div className="divider divider-vertical"></div>
                {parse(`${renderHtml}`)}
            </section>
        );
    }
    const extensions = tiptapExtensions(["Image", "Link", "Youtube"]);
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            ...extensions,
            Placeholder,
            AutocompleteGemini,
            TiptapImage.configure({
                HTMLAttributes: {
                    class: "mx-auto",
                },
            }),
            TiptapLink.extend({
                inclusive: false,
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: "mx-auto",
                },
            }),
        ],
        content: (editOrDraft?.content as JSONContent) ?? "",
        editorProps: {
            attributes: {
                class: prose,
            },
            handleKeyDown(view, event) {
                if (event.key === "Tab") {
                    if (!insertContentState) {
                        event.preventDefault();
                        setInsertContentState(true);
                    }
                } else {
                    clearTimeout(insertContentTimeout.current);
                    setInsertContentState(false);
                }
            },
        },
    });

    const insertContent = useCallback(
        async (words: string) => {
            editor!.extensionStorage.AutocompleteExtension.autosuggestion =
                '<span class="generating"><span>&#x2022;</span><span>&#x2022;</span><span>&#x2022;</span></span>';

            editor?.commands.setMeta("triggerSuggestion", true);
            const autocomplete = await autocompleteGemini(words);
            if (autocomplete) {
                editor!.extensionStorage.AutocompleteExtension.autosuggestion =
                    autocomplete;
            } else {
                editor!.extensionStorage.AutocompleteExtension.autosuggestion =
                    "";
            }
            editor?.commands.setMeta("triggerSuggestion", false);
        },
        [editor],
    );

    useEffect(() => {
        if (insertContentState) {
            const prompt = editor?.getText();
            if (!prompt) return;
            setInsertContentState(false);
            if (
                !insertContentTimeout.current ||
                insertContentTimeout.current === undefined
            ) {
                insertContentTimeout.current = setTimeout(
                    async () => await insertContent(prompt),
                    1000,
                );
            } else {
                clearTimeout(insertContentTimeout.current);
                insertContentTimeout.current = setTimeout(
                    async () => await insertContent(prompt),
                    1000,
                );
            }
        }
    }, [
        editor,
        editor?.state.doc,
        editor?.state.selection.anchor,
        insertContent,
        insertContentState,
    ]);

    const editorTitle = useEditor({
        immediatelyRender: false,
        extensions: [
            Placeholder.configure({
                placeholder: "Your title here",
            }),
            StarterKit,
        ],
        content: `<h1>${editOrDraft?.title ?? ""}</h1>`,
        editorProps: {
            attributes: {
                class: prose,
            },
        },
    });

    const editorDescription = useEditor({
        immediatelyRender: false,
        extensions: [
            Placeholder.configure({
                placeholder: "A discerning description",
            }),
            StarterKit,
        ],
        content: `<h4>${editOrDraft?.description ?? ""}</h4>`,
        editorProps: {
            attributes: {
                class: prose,
            },
        },
    });

    // temporarily fixes the title and desc heading when cleared by the user, only sets heading again when there is a content
    useEffect(() => {
        editorTitle?.commands.setHeading({ level: 1 });
        editorDescription?.commands.setHeading({ level: 4 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorDescription?.$doc.textContent, editorTitle?.$doc.textContent]);

    useEffect(() => {
        const savePostDraft = async () => {
            if (publishState) return;
            setIsAutoSavingDraft(true);
            const formData = new FormData();
            const json = editor?.getJSON();
            const editorImages = json?.content?.filter(
                (image) => image.type === "image",
            );

            const images = async () => {
                let images: File[] = [];
                if (editorImages) {
                    //fetch all images in the editor and turn them into a File given the name of img_index with a type of image/png and push them into an array of File
                    for (const [index, image] of Object.entries(editorImages)) {
                        const fetchImg = await fetch(image?.attrs?.src)
                            .then((file) => file.blob())
                            .then(
                                (blob) =>
                                    new File([blob], `img_${index}`, {
                                        type: "image/png",
                                    }),
                            );
                        images.push(fetchImg);
                    }
                }
                return images;
            };
            if (coverImageFile) {
                formData.append("coverImage", coverImageFile as File);
            } else {
                const draftImg = await fetch(editOrDraft?.coverImage as string)
                    .then((file) => file.blob())
                    .then(
                        (blob) =>
                            new File([blob], "img_cover", {
                                type: "image/png",
                            }),
                    );
                if (draftImg) formData.append("coverImage", draftImg);
            }
            if ((await images()).length !== 0) {
                // append a form data of image_total given the total length of the array
                formData.append(
                    "image_total",
                    Object.keys(await images()).length as unknown as string,
                );
                // iterate over the images and append them with their respective index and the image File itself
                for (const [index, image] of Object.entries(await images())) {
                    formData.append(`image_${index}`, image);
                }
            }
            formData.append("title", editorTitle?.getText() as string);
            formData.append(
                "description",
                editorDescription?.getText() as string,
            );
            formData.append("content", JSON.stringify(json));
            formData.append("tags", JSON.stringify(inputTags));
            formData.append("org", JSON.stringify(selectedOrg));
            await fetch("/api/post/draft", {
                method: "POST",
                body: formData,
            });
            setIsAutoSavingDraft(false);
            postDraftTimeout.current = undefined;
        };
        const editorsUpdating = () => {
            if (mode !== "edit" && !publishState) {
                if (
                    editorTitle?.getText() ||
                    editorDescription?.getText() ||
                    editor?.getText()
                ) {
                    if (
                        !postDraftTimeout.current ||
                        postDraftTimeout.current === undefined
                    ) {
                        postDraftTimeout.current = setTimeout(
                            () => savePostDraft(),
                            5000,
                        );
                    } else {
                        clearTimeout(postDraftTimeout.current);
                        postDraftTimeout.current = setTimeout(
                            () => savePostDraft(),
                            5000,
                        );
                    }
                }
            }
        };
        if (coverImageFile) {
            editorsUpdating();
        }
        if (inputTags) {
            editorsUpdating();
        }
        editorTitle?.on("update", () => {
            editorsUpdating();
        });
        editorDescription?.on("update", () => {
            editorsUpdating();
        });
        editor?.on("update", () => {
            editorsUpdating();
        });
        if (publishState) {
            clearTimeout(postDraftTimeout.current);
        }
    }, [
        coverImageFile,
        editOrDraft?.coverImage,
        editor,
        editorDescription,
        editorTitle,
        inputTags,
        mode,
        publishState,
        selectedOrg,
    ]);

    function addCoverImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        if (event.target.files[0]) {
            setCoverImage(URL.createObjectURL(event.target.files[0]));
            setCoverImageFile(event.target.files[0]);
        }
    }

    function modalCoverImage(event: React.MouseEvent<HTMLLabelElement>) {
        if (coverImage) {
            event.preventDefault();
            modal_coverImage.current?.show();
            setModalOpenState(true);
        }
    }

    function addTag(tag: string) {
        if (inputTags.length < 4) {
            setInputTags([...inputTags, tag]);
            setTagList([...tagList.filter((tagName) => tagName !== tag)]);
            setSearchTag("");
            const elem = document.activeElement as HTMLElement;
            elem?.blur();
        }
    }

    async function validateTagAddition() {
        const validate = await validateTag(
            searchTag.toLowerCase().replace(/\s/g, ""),
        );
        if (validate) {
            addTag(searchTag.toLowerCase().replace(/\s/g, ""));
            setTagValidateResult(true);
            setSearchTag("");
            const elem = document.activeElement as HTMLElement;
            elem?.blur();
        } else {
            setTagValidateResult(false);
        }
    }

    function removeTag(tag: string) {
        setTagList([...tagList, tag]);
        setInputTags(() => [...inputTags.filter((tagName) => tagName !== tag)]);
    }

    function togglePreview() {
        setPreview(() => !preview);
    }

    async function uploadPost(publish: boolean) {
        if (isAutoSavingDraft) return;
        if (!publish) setIsSavingDraft(true);
        setPublishState(true);
        const json = editor?.getJSON();
        const editorImages = json?.content?.filter(
            (image) => image.type === "image",
        );
        const images = async () => {
            let images: File[] = [];
            if (editorImages) {
                //fetch all images in the editor and turn them into a File given the name of img_index with a type of image/png and push them into an array of File
                for (const [index, image] of Object.entries(editorImages)) {
                    const fetchImg = await fetch(image?.attrs?.src)
                        .then((file) => file.blob())
                        .then(
                            (blob) =>
                                new File([blob], `img_${index}`, {
                                    type: "image/png",
                                }),
                        );
                    images.push(fetchImg);
                }
            }
            return images;
        };
        const readPerMinute = Math.round(
            editor?.storage.characterCount.words() / 238,
        );
        const formData = new FormData();
        if (coverImageFile) {
            formData.append("coverImage", coverImageFile as File);
        } else {
            const draftImg = await fetch(editOrDraft?.coverImage as string)
                .then((file) => file.blob())
                .then(
                    (blob) =>
                        new File([blob], "img_cover", {
                            type: "image/png",
                        }),
                );
            if (draftImg) formData.append("coverImage", draftImg);
        }
        if ((await images()).length !== 0) {
            // append a form data of image_total given the total length of the array
            formData.append(
                "image_total",
                Object.keys(await images()).length as unknown as string,
            );
            // iterate over the images and append them with their respective index and the image File itself
            for (const [index, image] of Object.entries(await images())) {
                formData.append(`image_${index}`, image);
            }
        }
        if (mode === "edit") {
            formData.append("postId", editOrDraft?.id!);
        }
        formData.append("username", username ? username : "");
        formData.append("title", editorTitle?.getText() as string);
        formData.append("description", editorDescription?.getText() as string);
        formData.append("content", JSON.stringify(json));
        formData.append("series", "test");
        formData.append("tags", JSON.stringify(inputTags));
        formData.append("readPerMinute", readPerMinute as unknown as string);
        formData.append("published", publish ? "true" : "false");
        formData.append("orgId", selectedOrg?.id ?? "");

        const passedRequirements = await checkPostRequirements();
        if (passedRequirements) {
            const uploadPost = await fetch("/api/post", {
                method: "POST",
                body: formData,
            });
            if (!uploadPost.ok) {
                setPublishState(false);
                if (!publish) setIsSavingDraft(false);
                setPostError({
                    ok: uploadPost.ok,
                    status: uploadPost.status,
                    statusText: uploadPost.statusText,
                    message: "Something went wrong, please try again later.",
                });
            } else {
                const result = await uploadPost.json();
                if (result) {
                    router.push(
                        publish
                            ? `/${username ?? userId}/${result.data}`
                            : `/${username ?? userId}/${result.data}/edit`,
                    );
                }
            }
        }
    }

    async function checkPostRequirements() {
        const wordsRequired = editor?.storage.characterCount.words() >= 50;
        const required: { [key: string]: boolean } = {
            title: !!editorTitle?.getText(),
            description: !!editorDescription?.getText(),
            coverImage: !!coverImage,
            wordsRequired: !!wordsRequired,
        };

        let requiredItems = [];

        for (const key in required) {
            if (required.hasOwnProperty(key)) {
                const value = required[key];
                if (!value) {
                    requiredItems.push(key);
                }
            }
        }
        if (Object.keys(requiredItems).length !== 0) {
            setPublishState(false);
            setPostError({
                ok: false,
                status: 499,
                statusText: "Required Fields",
                message:
                    requiredItems.filter((item) => item !== "wordsRequired")
                        .length !== 0
                        ? `The following fields: ${requiredItems.filter(
                              (item) => item !== "wordsRequired",
                          )} cannot be blank.`
                        : !wordsRequired
                          ? "Insufficient words, need a minimum of 50 words to publish."
                          : "",
            });
            return false;
        }
        return true;
    }
    return (
        <>
            <div className=" z-50 sticky top-0 bg-base-100 rounded-lg">
                <div className="flex flex-wrap justify-center p-2">
                    <div className="flex items-center overflow-auto space-x-4">
                        <label
                            htmlFor="coverImage"
                            className={`btn ${
                                coverImage ? "btn-info" : "btn-outline"
                            }`}
                            onClick={modalCoverImage}
                        >
                            {coverImage
                                ? "View Cover Image"
                                : "Add Cover Image"}
                        </label>
                        <input
                            type="file"
                            id="coverImage"
                            accept="image/png, image/jpeg"
                            onChange={addCoverImage}
                            hidden
                        />
                        <button
                            className={`btn ${
                                preview ? "btn-info" : "btn-outline"
                            }`}
                            onClick={togglePreview}
                        >
                            {preview ? "Edit" : "Preview"}
                        </button>
                        <button
                            className="btn btn-outline"
                            disabled={
                                publishState ||
                                isAutoSavingDraft ||
                                isSavingDraft
                            }
                            onClick={() => uploadPost(false)}
                        >
                            {isSavingDraft && (
                                <span className="loading loading-spinner"></span>
                            )}
                            {isSavingDraft ? "Saving..." : "Save as Draft"}
                        </button>
                        <button
                            className="btn btn-success btn-outline"
                            disabled={publishState || isAutoSavingDraft}
                            onClick={() => uploadPost(true)}
                        >
                            {publishState
                                ? mode === "edit"
                                    ? "Updating"
                                    : "Publishing..."
                                : mode === "edit"
                                  ? "Update"
                                  : isAutoSavingDraft
                                    ? "Saving..."
                                    : "Publish"}
                        </button>
                    </div>
                </div>

                {coverImage && (
                    <Modal
                        className="overflow-auto space-y-4"
                        ref={modal_coverImage}
                    >
                        <NextImage
                            className="mx-auto"
                            src={coverImage as string}
                            alt="image"
                            width={400}
                            height={400}
                        />
                        <label
                            htmlFor="coverImage"
                            className="btn btn-neutral flex justify-center align-middle"
                        >
                            Change
                        </label>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button
                                    className="btn"
                                    onClick={() => setModalOpenState(false)}
                                >
                                    Close
                                </button>
                            </form>
                        </div>
                    </Modal>
                )}
            </div>
            <StautsNotif {...(postError as StatusResponse)} />
            {preview ? (
                <>
                    <PreviewEditor />
                </>
            ) : (
                <>
                    <EditorContent editor={editorTitle} />
                    <EditorContent editor={editorDescription} />
                    <div className={cn("!mb-2", prose)}>
                        <div className="dropdown container">
                            <input
                                type="text"
                                placeholder="Add tags"
                                value={searchTag}
                                onChange={(e) => {
                                    setTagValidateResult(undefined);
                                    setSearchTag(
                                        e.currentTarget.value
                                            .toLowerCase()
                                            .replace(/\s/g, ""),
                                    );
                                }}
                                className="input input-ghost"
                            />
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu max-h-[24rem] overflow-auto shadow bg-base-200 rounded-box z-50"
                            >
                                <span className="flex flex-wrap">
                                    {tagList.length !== 0 &&
                                    tagList.filter((tag) =>
                                        tag
                                            .toLowerCase()
                                            .includes(searchTag.toLowerCase()),
                                    ).length !== 0 ? (
                                        tagList
                                            .filter((tag) =>
                                                tag
                                                    .toLowerCase()
                                                    .includes(
                                                        searchTag.toLowerCase(),
                                                    ),
                                            )
                                            .sort()
                                            .map(
                                                (
                                                    tag: string,
                                                    index: number,
                                                ) => (
                                                    <Fragment key={index}>
                                                        <li
                                                            onClick={() =>
                                                                addTag(tag)
                                                            }
                                                        >
                                                            <a>{tag}</a>
                                                        </li>
                                                    </Fragment>
                                                ),
                                            )
                                    ) : (
                                        <li>
                                            <a onClick={validateTagAddition}>
                                                {" "}
                                                {tagValidateResult === undefined
                                                    ? "Click here to add your custom tag"
                                                    : !tagValidateResult
                                                      ? "Tag contains malicious or nonsense word. Try again."
                                                      : "Click here to add your custom tag"}
                                            </a>
                                        </li>
                                    )}
                                </span>
                            </ul>
                            <div className="flex flex-wrap items-center gap-4">
                                {inputTags &&
                                    inputTags.map(
                                        (tag: string, index: number) => (
                                            <Fragment key={index}>
                                                <div className="flex flex-wrap items-center space-x-2">
                                                    <p className="text-lg rounded link-primary">
                                                        #{tag}
                                                    </p>
                                                    <p
                                                        className="text-red-400 cursor-pointer"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                    >
                                                        x
                                                    </p>
                                                </div>
                                            </Fragment>
                                        ),
                                    )}
                                <p className="text-sm">Up to 4 tags only</p>
                            </div>
                        </div>
                    </div>
                    <MenuBar
                        editor={editor}
                        className={cn(
                            `!mt-2 ${mode === "edit" && "!top-16"} ${
                                modalOpenState && "!z-0"
                            }`,
                            prose,
                        )}
                    />
                    <EditorContent editor={editor} className="mb-24" />
                </>
            )}
        </>
    );
}
