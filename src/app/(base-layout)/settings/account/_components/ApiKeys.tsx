"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { FormContext } from "@/types/formContext";
import { generateApiKey, revokeApiKey } from "@/utils/actions/account";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
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

    const createApiKeyModalRef = useRef<HTMLDialogElement>(null);
    const deleteApiKeyModalRef = useRef<HTMLDialogElement>(null);

    const successApiKeyCreationModalRef = useRef<HTMLDialogElement>(null);
    const [newApiKeyCreated, setNewApiKeyCreated] = useState<string>("");

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
        deleteApiKeyModalRef.current?.show();
    }

    const addApiKey = form.handleSubmit(async (data) => {
        const duplicateName = apiKeys.find(
            (apiKey) => apiKey.name === data.Name,
        );
        if (!duplicateName) {
            const generatedApiKey = await generateApiKey(data.Name);
            if (generatedApiKey) {
                setApiKeys([...apiKeys, generatedApiKey.maskedApiKey]);
                toast.success("API key successfully created", {
                    id: "apiKey",
                });
                createApiKeyModalRef.current?.close();
                setNewApiKeyCreated(generatedApiKey.rawKey);
                successApiKeyCreationModalRef.current?.show();
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
                    id: "apiKey",
                });
            }
        }
        deleteApiKeyModalRef.current?.close();
    };

    return (
        <div className="pt-4">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">API Keys</h1>
                <button
                    className="btn btn-primary btn-md"
                    onClick={() => createApiKeyModalRef.current?.show()}
                >
                    Create
                </button>
            </div>

            <Modal ref={createApiKeyModalRef}>
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

            <Modal ref={successApiKeyCreationModalRef}>
                <h2 className="text-lg font-bold">
                    Congratulations, you have created an API key.
                </h2>
                <p className="text-md mt-2">
                    Please copy the API key and store it in a secure place. For
                    security purposes, you will not be able to access this
                    secret key again.
                </p>
                <div className="flex justify-center">
                    <div className="join mt-4">
                        <input
                            className="input input-bordered join-item w-full"
                            defaultValue={newApiKeyCreated}
                        />
                        <button
                            className="btn join-item rounded-r-full bg-transparent"
                            onClick={() => {
                                navigator.clipboard.writeText(newApiKeyCreated);
                                toast.success("API Key copied", {
                                    id: "apiKey",
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faClipboard} />
                        </button>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button
                            className="btn"
                            onClick={() => setNewApiKeyCreated("")}
                        >
                            Close
                        </button>
                    </form>
                </div>
            </Modal>

            <Modal ref={deleteApiKeyModalRef}>
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
