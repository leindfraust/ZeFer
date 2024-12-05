import QueryWrapper from "@/components/provider/QueryWrapper";
import TagList from "@/components/tag/TagList";

export default async function SearchTags({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const keyword = q;
    return (
        <QueryWrapper>
            <TagList keyword={keyword as string} />
        </QueryWrapper>
    );
}
