import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import AccountSettingsComponent from "@/app/(base-layout)/settings/account/_components/Account";
import ApiKeys from "./_components/ApiKeys";

export default async function AccountSettings() {
    const session = await getServerSession(authConfig);
    const linkedProviders = await prisma.account.findMany({
        where: { userId: session?.user.id },
        select: {
            id: true,
            providerAccountId: true,
            provider: true,
        },
    });
    const apiKeys = await prisma.apiKey.findMany({
        where: { ownerId: session?.user.id },
    });

    return (
        <div className="mx-auto lg:w-9/12 justify-center">
            <div className="shadow-lg p-12 rounded-md space-y-2">
                <AccountSettingsComponent providers={[...linkedProviders]} />
                <ApiKeys initialApiKeys={apiKeys} />
            </div>
        </div>
    );
}
