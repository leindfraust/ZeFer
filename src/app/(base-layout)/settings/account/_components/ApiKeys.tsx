"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { FormContext } from "@/types/formContext";
import { generateApiKey, revokeApiKey } from "@/utils/actions/account";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiKey } from "@prisma/client";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function ApiKeys({
    initialApiKeys,
}: {
    initialApiKeys: ApiKey[];
}) {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);

    const createApiModalRef = useRef<HTMLDialogElement>(null);
    const deleteApiModalRef = useRef<HTMLDialogElement>(null);

    const [toDelApiKeyId, setToDelApiKeyId] = useState<string>();

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

    function delApiKeyModalPrompt({ id }: ApiKey) {
        setToDelApiKeyId(id);
        deleteApiModalRef.current?.show();
    }

    const addApiKey = form.handleSubmit(async (data) => {
        const duplicateName = apiKeys.find(
            (apiKey) => apiKey.name === data.Name,
        );
        if (!duplicateName) {
            const generatedApiKey = await generateApiKey(data.Name);
            if (generatedApiKey) {
                setApiKeys([...apiKeys, generatedApiKey]);
                toast.success("API key successfully created", {
                    id: "123",
                });
                createApiModalRef.current?.close();
            }
        } else {
            form.setError("Name", {
                type: "uniqueConstraint",
                message: `${data.Name} already exists.`,
            });
        }
    });

    const deleteApiKey = async () => {
        if (toDelApiKeyId) {
            const deleteApiKey = await revokeApiKey(toDelApiKeyId);
            if (deleteApiKey) {
                setApiKeys([...deleteApiKey]);
                toast.success("API Key successfully deleted", {
                    id: "123",
                });
            }
        }
        deleteApiModalRef.current?.close();
    };

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

            <Modal ref={deleteApiModalRef}>
                <h2 className="text-lg font-bold">
                    Are you sure you want to delete{" "}
                </h2>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Cancel</button>
                    </form>
                    <button className="btn btn-neutral" onClick={deleteApiKey}>
                        Confirm
                    </button>
                </div>
            </Modal>

            {apiKeys.length !== 0 ? (
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>NAME</th>
                                <th>KEY</th>
                                <th>CREATED</th>
                                <th>LAST USED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map((apiKey) => (
                                <tr key={apiKey.id}>
                                    <th>
                                        {
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                color="red"
                                                cursor={"pointer"}
                                                onClick={() =>
                                                    delApiKeyModalPrompt(apiKey)
                                                }
                                            />
                                        }
                                    </th>
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
