import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import AccountSettingsComponent from "@/components/settings/Account";


export default async function AccountSettings() {
    const session = await getServerSession(authConfig)
    const linkedProviders = await prisma.account.findMany({
        where: { userId: session?.user.id },
        select: {
            id: true,
            providerAccountId: true,
            provider: true
        }
    })

    return (<AccountSettingsComponent providers={[...linkedProviders]} />)
}