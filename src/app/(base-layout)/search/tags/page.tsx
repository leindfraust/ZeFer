import QueryWrapper from "@/components/provider/QueryWrapper";
import TagList from "@/components/tag/TagList";

export default function SearchTags({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const keyword = searchParams.q;
    return (
        <QueryWrapper>
            <TagList keyword={keyword as string} />
        </QueryWrapper>
    );
}
