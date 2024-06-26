import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HighLight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";

export default function tiptapExtensions() {
    const extensions = [
        TaskList,
        TaskItem,
        HighLight,
        StarterKit,
        Image,
        Link,
        Youtube,
        CharacterCount,
    ];
    return extensions;
}
