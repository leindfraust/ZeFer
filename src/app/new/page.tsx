import Tiptap from "@/components/wysiwyg/Tiptap";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import PostTypeSelector from "@/components/post/PostTypeSelector";
export default async function CreatePost() {
    const session = await getServerSession(authConfig);
    const user = await prisma.user.findUnique({
        where: { id: session?.user.id },
        select: {
            id: true,
            username: true,
            draft: true,
            organizations:true,
            ownedOrganizations:true,
        },
    });

    const tags = await import("../api/tag/route");

    return (
        <PostTypeSelector
            userId={user?.id}
            username={user?.username}
            editOrDraft={user?.draft! ?? undefined}
            mode={user?.draft ? "draft" : undefined}
            tags={[...(await (await tags.GET()).json())]}
            orgs={user?.organizations}
          ownOrg={user?.ownedOrganizations}
        />
    );
}
