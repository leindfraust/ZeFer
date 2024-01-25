"use client";
import { deleteUser, unlinkAccount } from "@/utils/actions/account";
import {
    IconDefinition,
    faGithub,
    faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useMemo, useState } from "react";

export default function AccountSettingsComponent({
    providers,
}: {
    providers: Array<{
        id: string;
        providerAccountId: string;
        provider: string;
    }>;
}) {
    const availableProviders = useMemo(() => {
        return ["google", "github"];
    }, []);

    const router = useRouter();
    const [inputDelete, setInputDelete] = useState<string>("");

    const findProvidersCanConnect = useCallback(() => {
        let providersAvailable: string[] = [];
        providers.forEach((provider) => {
            const getInitialProviders = availableProviders.find(
                (providerName) => providerName !== provider.provider,
            );
            const checkProviderConnected = providers.find(
                (provider) => provider.provider === getInitialProviders,
            );
            if (getInitialProviders && !checkProviderConnected) {
                const providerDuplicate = providersAvailable.find(
                    (provider) => provider === getInitialProviders,
                );
                if (!providerDuplicate || providerDuplicate === undefined) {
                    providersAvailable.push(getInitialProviders);
                }
            }
        });
        return providersAvailable;
    }, [availableProviders, providers]);

    const providersCanConnect = useMemo(
        () => findProvidersCanConnect(),
        [findProvidersCanConnect],
    );

    const providersCanRemove = useMemo(() => {
        let providersAvailable: string[] = [];
        providers.forEach((provider) => {
            const providerCanRemove = availableProviders.find(
                (providerName) => providerName === provider.provider,
            );
            if (providerCanRemove) {
                providersAvailable.push(providerCanRemove);
            }
        });
        return providersAvailable;
    }, [availableProviders, providers]);

    async function unlinkProviderAccount(providerLinked: string) {
        const providerDetails = providers.find(
            (provider) => provider.provider === providerLinked,
        );
        if (providerDetails) {
            const unlink = await unlinkAccount(
                providerDetails.id,
                providerDetails.providerAccountId,
            );
            if (unlink) router.refresh();
        }
    }

    function pickProviderLogo(provider: string): IconDefinition {
        if (provider === "google") return faGoogle;
        if (provider === "github") return faGithub;
        return faGlobe;
    }

    async function deleteAccount() {
        const deleteUserAccount = await deleteUser();
        if (deleteUserAccount) signOut();
    }

    function ProviderList({
        linkAction,
        providers,
    }: {
        linkAction: "Connect" | "Remove";
        providers: string[];
    }) {
        return (
            <>
                <div className="container pt-4">
                    <div className="lg:space-x-4 space-y-4">
                        <h2 className="text-xl">{linkAction} OAuth Accounts</h2>
                        {providers.map((provider) => (
                            <Fragment key={provider}>
                                <button
                                    onClick={() =>
                                        linkAction === "Connect"
                                            ? signIn(provider)
                                            : unlinkProviderAccount(provider)
                                    }
                                >
                                    <div
                                        className={`flex gap-4 items-center shadow-md w-72 justify-center p-4 ${
                                            linkAction === "Remove" &&
                                            "bg-error text-white"
                                        } rounded-lg`}
                                    >
                                        <FontAwesomeIcon
                                            icon={pickProviderLogo(provider)}
                                            size="xl"
                                        />
                                        <p className="text-md">
                                            {linkAction === "Connect"
                                                ? "Sign in with"
                                                : "Remove"}{" "}
                                            {provider.charAt(0).toUpperCase() +
                                                provider.slice(1)}
                                        </p>
                                    </div>
                                </button>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {providersCanConnect.length !== 0 && (
                <ProviderList
                    linkAction="Connect"
                    providers={providersCanConnect}
                />
            )}
            {providersCanRemove.length > 1 && (
                <ProviderList
                    linkAction="Remove"
                    providers={providersCanRemove}
                />
            )}
            <div className="container pt-4">
                <h2 className="text-xl">Delete Account</h2>
                <p className="text-md mt-4">
                    Deleting your account will remove all your posts, reactions,
                    comments and your information stored within our database.
                </p>
                <div className="mt-4 mb-4">
                    <input
                        className="input input-bordered"
                        onChange={(e) => setInputDelete(e.currentTarget.value)}
                    />
                    <p className="text-sm mt-2">
                        Type &quot;DELETE&quot; to proceed on deleting your
                        account.
                    </p>
                </div>
                <button
                    className="btn btn-error text-white"
                    value={inputDelete}
                    disabled={inputDelete !== "DELETE"}
                    onClick={deleteAccount}
                >
                    Delete Account
                </button>
            </div>
        </>
    );
}
