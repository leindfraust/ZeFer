import QueryWrapper from "@/components/provider/QueryWrapper";
import NotificationList from "../_components/NotificationList";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";

export default async function NotificationsPosts() {
    const session = await getServerSession(authConfig);
    await prisma.userNotifications.updateMany({
        where: {
            userId: session?.user.id,
        },
        data: {
            new: false,
        },
    });

    return (
        <QueryWrapper>
            <NotificationList />
        </QueryWrapper>
    );
}
