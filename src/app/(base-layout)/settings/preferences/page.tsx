import ThemeSwitcher from "@/app/(base-layout)/settings/preferences/_components/ThemeSwitcher";
import NotificationSettings from "@/app/(base-layout)/settings/preferences/_components/NotificationSettings";
import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { getServerSession } from "next-auth";

export default async function PreferenceSettings() {
    const session = await getServerSession(authConfig);
    const user = await prisma.user.findUnique({
        where: { id: session?.user.id },
        select: {
            sendNotificationEmail: true,
            sendNotificationPhone: true,
        },
    });

    return (
        <div className="mx-auto lg:w-9/12 justify-center">
            <div className="shadow-lg p-12 rounded-md space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-6">Preferences</h1>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 items-center">
                            <div>
                                <h2 className="text-xl font-semibold">System Theme</h2>
                                <p className="text-sm opacity-70">
                                    Choose your preferred theme
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <ThemeSwitcher />
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div>
                            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                            <NotificationSettings
                                sendNotificationEmail={user?.sendNotificationEmail ?? true}
                                sendNotificationPhone={user?.sendNotificationPhone ?? false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
