import QueryWrapper from "@/components/provider/QueryWrapper";
import SeriesManageContainer from "@/app/(base-layout)/manage/series/_components/SeriesManageContainer";

export default function ManageSeries() {
    return (
        <>
            <QueryWrapper>
                <SeriesManageContainer />
            </QueryWrapper>
        </>
    );
}
