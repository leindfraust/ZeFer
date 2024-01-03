import PeopleList from "@/components/people/PeopleList";
import QueryWrapper from "@/components/provider/QueryWrapper";

export default function SearchPeople({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const keyword = searchParams.q;
    return (
        <QueryWrapper>
            <PeopleList keyword={keyword as string} />
        </QueryWrapper>
    );
}
