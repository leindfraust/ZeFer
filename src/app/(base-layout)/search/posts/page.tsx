import PostList from "@/components/PostList"
import QueryWrapper from "@/components/QueryWrapper"

export default function SearchPosts({ searchParams }: { searchParams: { q?: string } }) {
    const keyword = searchParams.q
    return (<QueryWrapper>
        <PostList keyword={keyword as string} />
    </QueryWrapper>)
}