"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { FormContext } from "@/types/formContext";
import { generateApiKey } from "@/utils/actions/account";
import { ApiKey } from "@prisma/client";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function ApiKeys({
    initialApiKeys,
}: {
    initialApiKeys: ApiKey[];
}) {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
    const createApiModalRef = useRef<HTMLDialogElement>(null);

    const form = useForm();

    const apiKey_validation: FormContext = {
        name: "Name",
        type: "text",
        placeholder: "ApiKey1",
        value: "",
        required: {
            value: true,
            message: "This field is required.",
        },
    };

    const addApiKey = form.handleSubmit(async (data) => {
        const duplicateName = apiKeys.find(
            (apiKey) => apiKey.name === data.Name,
        );
        if (!duplicateName) {
            const generatedApiKey = await generateApiKey(data.Name);
            if (generatedApiKey) setApiKeys([...apiKeys, generatedApiKey]);
        } else {
            form.setError("Name", {
                type: "uniqueConstraint",
                message: `${data.Name} already exists.`,
            });
        }
    });
    return (
        <div className="pt-4">
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">API Keys</h1>
                <button
                    className="btn btn-primary btn-md"
                    onClick={() => createApiModalRef.current?.show()}
                >
                    Create
                </button>
            </div>
            <Modal ref={createApiModalRef}>
                <h2 className="text-lg font-bold">Create New Secret Key</h2>
                <FormProvider {...form}>
                    <Input {...apiKey_validation} />
                </FormProvider>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Cancel</button>
                    </form>
                    <button className="btn btn-neutral" onClick={addApiKey}>
                        Confirm
                    </button>
                </div>
            </Modal>
            {apiKeys.length !== 0 ? (
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>KEY</th>
                                <th>CREATED</th>
                                <th>LAST USED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {apiKeys.map((apiKey) => (
                                <tr key={apiKey.id}>
                                    <th>{apiKey.name}</th>
                                    <td>{apiKey.key}</td>
                                    <td>
                                        {new Date(
                                            apiKey.createdAt,
                                        ).toDateString()}
                                    </td>
                                    <td>
                                        {apiKey.lastUsed &&
                                            new Date(
                                                apiKey.lastUsed,
                                            ).toDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-md">No API keys yet. Create one</p>
            )}
        </div>
    );
}
