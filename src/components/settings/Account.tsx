"use client"
import { deleteUser, unlinkAccount } from "@/utils/actions/account"
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AccountSettingsComponent({ providers }: {
    providers: Array<{
        id: string,
        providerAccountId: string,
        provider: string
    }>
}) {

    const router = useRouter()
    const [inputDelete, setInputDelete] = useState<string>('')

    async function unlinkProviderAccount(providerLinked: string) {
        const providerDetails = providers.find(provider => provider.provider === providerLinked)
        if (providerDetails) {
            const unlink = await unlinkAccount(providerDetails.id, providerDetails.providerAccountId)
            if (unlink) router.refresh()
        }
    }

    async function deleteAccount() {
        const deleteUserAccount = await deleteUser()
        if (deleteUserAccount) router.push('/')
    }

    return (<>
        <div className="mx-auto lg:w-9/12 justify-center">
            <div className='shadow-lg p-12 rounded-md space-y-2'>
                <div className="space-x-4">
                    {!(providers.find(provider => provider.provider === 'google')) && (
                        <button onClick={() => signIn('google')}>
                            <div className="flex gap-4 items-center shadow-md w-72 justify-center p-4 rounded-lg">
                                <FontAwesomeIcon icon={faGoogle} size="xl" />
                                <p className="text-md">Connect with Google</p>
                            </div>
                        </button>
                    )}
                    {!(providers.find(provider => provider.provider === 'github')) && (
                        <button onClick={() => signIn('github')}>
                            <div className="flex gap-4 items-center shadow-md w-72 justify-center p-4 rounded-lg">
                                <FontAwesomeIcon icon={faGithub} size="xl" />
                                <p className="text-md">Connect with Github</p>
                            </div>
                        </button>
                    )}
                </div>
                <h1 className="text-3xl font-bold text-error pt-4">Danger Zone</h1>
                {providers.length > 1 && (<>
                    <div className="container pt-4">
                        <div className="space-x-4">
                            <h2 className="text-xl">Remove OAuth Accounts</h2>
                            {(providers.find(provider => provider.provider === 'google')) && (
                                <button onClick={() => unlinkProviderAccount('google')}>
                                    <div className="flex gap-4 items-center shadow-md w-72 justify-center p-4 bg-error text-white rounded-lg">
                                        <FontAwesomeIcon icon={faGoogle} size="xl" />
                                        <p className="text-md">Remove Google</p>
                                    </div>
                                </button>
                            )}
                            {(providers.find(provider => provider.provider === 'github')) && (
                                <button onClick={() => unlinkProviderAccount('github')}>
                                    <div className="flex gap-4 items-center shadow-md w-72 justify-center p-4 bg-error text-white rounded-lg">
                                        <FontAwesomeIcon icon={faGithub} size="xl" />
                                        <p className="text-md">Remove Github</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </>)}
                <div className="container pt-4">
                    <h2 className="text-xl">Delete Account</h2>
                    <p className="text-md mt-4">Deleting your account will remove all your posts, reactions, comments and your information stored within our database.</p>
                    <div className="mt-4 mb-4">
                        <input className="input input-bordered" onChange={(e) => setInputDelete(e.currentTarget.value)} />
                        <p className="text-sm mt-2">Type &quot;DELETE&quot; to proceed on deleting your account.</p>
                    </div>
                    <button className='btn btn-error text-white' value={inputDelete} disabled={inputDelete !== 'DELETE'} onClick={deleteAccount}>Delete Account</button>
                </div>
            </div>
        </div>
    </>)
}