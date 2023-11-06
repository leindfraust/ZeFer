import QueryWrapper from "@/components/QueryWrapper"
import TagList from "@/components/TagList"

export default function SearchTags({ searchParams }: { searchParams: { q?: string } }) {
    const keyword = searchParams.q
    return (<QueryWrapper>
        <TagList keyword={keyword as string} />
    </QueryWrapper>)
}