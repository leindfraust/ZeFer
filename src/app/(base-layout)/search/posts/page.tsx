import PostList from "@/components/post/PostList";
import QueryWrapper from "@/components/provider/QueryWrapper";

export default function SearchPosts({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const keyword = searchParams.q;
    return (
        <QueryWrapper>
            <PostList keyword={keyword as string} />
        </QueryWrapper>
    );
}
