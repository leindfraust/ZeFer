import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HighLight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";

type exclusionList =
    | "TaskList"
    | "TaskItem"
    | "HighLight"
    | "StarterKit"
    | "Image"
    | "Link"
    | "Youtube"
    | "CharacterCount";

export default function tiptapExtensions(
    toExclude?: exclusionList | exclusionList[],
) {
    const extensions = [
        { name: "TaskList", ext: TaskList },
        { name: "TaskItem", ext: TaskItem },
        { name: "HighLight", ext: HighLight },
        { name: "StarterKit", ext: StarterKit },
        { name: "Image", ext: Image },
        { name: "Link", ext: Link },
        { name: "Youtube", ext: Youtube },
        { name: "CharacterCount", ext: CharacterCount },
    ];

    if (toExclude) {
        if (Array.isArray(toExclude)) {
            return extensions
                .filter(
                    (extension) =>
                        !toExclude.includes(extension.name as exclusionList),
                )
                .map((extension) => extension.ext);
        } else {
            return extensions
                .filter((extension) => extension.name !== toExclude)
                .map((extension) => extension.ext);
        }
    }

    return extensions.map((extension) => extension.ext);
}
