"use client";

import { updateNotificationPreferences } from "@/utils/actions/user";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface NotificationSettingsProps {
    sendNotificationEmail: boolean;
    sendNotificationPhone: boolean;
}

export default function NotificationSettings({
    sendNotificationEmail: initialEmail,
    sendNotificationPhone: initialPhone,
}: NotificationSettingsProps) {
    const [emailEnabled, setEmailEnabled] = useState(initialEmail);
    const [phoneEnabled, setPhoneEnabled] = useState(initialPhone);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEmailToggle = async (checked: boolean) => {
        setIsUpdating(true);
        try {
            const result = await updateNotificationPreferences({
                sendNotificationEmail: checked,
                sendNotificationPhone: phoneEnabled,
            });

            if (result.success) {
                setEmailEnabled(checked);
                toast.success(
                    `Email notifications ${checked ? "enabled" : "disabled"}`,
                );
            } else {
                toast.error("Failed to update notification preferences");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePhoneToggle = async (checked: boolean) => {
        setIsUpdating(true);
        try {
            const result = await updateNotificationPreferences({
                sendNotificationEmail: emailEnabled,
                sendNotificationPhone: checked,
            });

            if (result.success) {
                setPhoneEnabled(checked);
                toast.success(
                    `Phone notifications ${checked ? "enabled" : "disabled"}`,
                );
            } else {
                toast.error("Failed to update notification preferences");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 items-center">
                <div>
                    <h2 className="text-xl font-semibold">Email Notifications</h2>
                    <p className="text-sm opacity-70">
                        Receive notifications via email
                    </p>
                </div>
                <div className="flex justify-end">
                    <input
                        type="checkbox"
                        className="toggle toggle-info"
                        checked={emailEnabled}
                        onChange={(e) => handleEmailToggle(e.target.checked)}
                        disabled={isUpdating}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 items-center">
                <div>
                    <h2 className="text-xl font-semibold">Phone Notifications</h2>
                    <p className="text-sm opacity-70">
                        Receive notifications via phone
                    </p>
                </div>
                <div className="flex justify-end">
                    <input
                        type="checkbox"
                        className="toggle toggle-info"
                        checked={phoneEnabled}
                        onChange={(e) => handlePhoneToggle(e.target.checked)}
                        disabled={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
}
