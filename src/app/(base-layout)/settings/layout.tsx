import SettingsLinks from "@/components/SettingsLinks"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Settings - ZeFer',
}

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<div className="mt-12 mb-12 lg:mr-28 lg:ml-28 mx-auto">
        <div className="lg:flex justify-center">
            <div className="p-4 mx-auto w-1/2 lg:w-1/6">
                <SettingsLinks />
            </div>
            <div className="flex-1 ml-4 mr-4">
                {children}
            </div>
        </div>
    </div>)
}