import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import OrganizationManageContainer from "./_components/OrganizationManageContainer";

export default async function ManageOrganizations() {
    const session = await getServerSession(authConfig);
    const organizations = await prisma.organization.findMany({
        where: {
            OR: [
                {
                    ownerId: session?.user.id,
                },
                {
                    admins: {
                        some: {
                            id: session?.user.id,
                        },
                    },
                },
                {
                    members: {
                        some: {
                            id: session?.user.id,
                        },
                    },
                },
            ],
        },
        include: {
            owner: true,
            admins: true,
            members: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    return (
        <div className="container">
            <div className="mx-auto lg:w-9/12 justify-center space-y-6">
                <OrganizationManageContainer
                    organizations={organizations}
                    sessionUserId={session?.user.id}
                />
            </div>
        </div>
    );
}
