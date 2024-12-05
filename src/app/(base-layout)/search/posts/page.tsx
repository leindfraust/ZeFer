import PostList from "@/components/post/PostList";
import QueryWrapper from "@/components/provider/QueryWrapper";
import { Suspense } from "react";

export default async function SearchPosts({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const keyword = q;
    return (
        <QueryWrapper>
            <Suspense>
                <PostList keyword={keyword as string} />
            </Suspense>
        </QueryWrapper>
    );
}
