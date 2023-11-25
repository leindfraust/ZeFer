import prisma from "@/db";
import { authConfig } from "@/utils/authConfig";
import ProfileSettingsComponent from "@/components/settings/ProfileSettings";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function ProfileSettings() {
    const session = await getServerSession(authConfig);
    const user = (await prisma.user.findUnique({
        where: { id: session?.user.id },
    })) as User;

    return <ProfileSettingsComponent {...user} />;
}
