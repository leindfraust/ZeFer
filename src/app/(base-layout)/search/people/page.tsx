import PeopleList from "@/components/people/PeopleList";
import QueryWrapper from "@/components/provider/QueryWrapper";

export default async function SearchPeople({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const keyword = q;
    return (
        <QueryWrapper>
            <PeopleList keyword={keyword as string} />
        </QueryWrapper>
    );
}
