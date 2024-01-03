import QueryWrapper from "@/components/provider/QueryWrapper";
import PostManageTable from "@/components/post/PostManageTable";

export default async function ManagePosts() {
    return (
        <div className="container">
            <QueryWrapper>
                <PostManageTable />
            </QueryWrapper>
        </div>
    );
}
