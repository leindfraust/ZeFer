import PostList from "@/components/post/PostList";
import QueryWrapper from "@/components/provider/QueryWrapper";
import { Suspense } from "react";

export default function SearchPosts({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const keyword = searchParams.q;
    return (
        <QueryWrapper>
            <Suspense>
                <PostList keyword={keyword as string} />
            </Suspense>
        </QueryWrapper>
    );
}
