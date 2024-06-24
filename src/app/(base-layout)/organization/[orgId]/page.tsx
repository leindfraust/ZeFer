import UserOrgProfile from "@/components/user/UserOrgProfile"
import prisma from "@/db"

const OrgProfilePage = async({params}:{params:{orgId:string}}) =>{
const {orgId} = params
const org = await prisma.organization.findFirst({
    where:{
        OR:[
            {
                id:orgId
            },
            {
                username:orgId /// this ORG ID CAN BE USERNAME TOO
            }
        ]
    },
    include:{
     _count:{
        select:{
            posts:true,
            members:true
        }
     }
    }
})
if(!org){
    return;
}
const posts = org._count.posts
const members = org._count.members
return (
    <>
    <UserOrgProfile org={org} orgId={org.id as string} posts={posts} members={members} />
    </>
)
}

export default OrgProfilePage