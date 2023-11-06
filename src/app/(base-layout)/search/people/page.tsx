import PeopleList from "@/components/PeopleList"
import QueryWrapper from "@/components/QueryWrapper"

export default function SearchPeople({ searchParams }: { searchParams: { q?: string } }) {
    const keyword = searchParams.q
    return (<QueryWrapper>
        <PeopleList keyword={keyword as string} />
    </QueryWrapper>)
}