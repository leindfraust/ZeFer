import Tiptap from "@/components/wysiwyg/Tiptap";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { PostDraft } from "@prisma/client";

export default async function CreatePost() {
    const session = await getServerSession(authConfig);
    const user = await prisma.user.findUnique({
        where: { id: session?.user.id },
        select: {
            id: true,
            username: true,
            draft: true,
        },
    });
    const tags = await import("../api/tag/route");

    return (
        <Tiptap
            userId={user?.id}
            username={user?.username}
            postDraft={(user?.draft as PostDraft) ?? ""}
            tags={[...(await (await tags.GET()).json())]}
        />
    );
}
