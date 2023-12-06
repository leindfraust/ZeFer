import ThemeSwitcher from "@/components/ThemeSwitcher";

export default async function PreferenceSettings() {
    return (
        <div className="mx-auto lg:w-9/12 justify-center">
            <div className="grid grid-cols-2 items-center">
                <h1 className="text-3xl font-semibold">System Theme</h1>
                <ThemeSwitcher />
            </div>
        </div>
    );
}
