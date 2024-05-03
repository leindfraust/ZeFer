"use client";

import type { FormContext } from "@/types/formContext";
import { RegisterOptions, useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import Input from "@/components/ui/Input";
import { FormSocials } from "@/types/user";
import { Fragment, useState } from "react";
import type { Organization } from "@prisma/client";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function OrganizationManageCreateContainer({
    id,
    name,
    image,
    username,
    socials,
    summary,
    setSelectedOrganization,
}: Partial<Organization> & { setSelectedOrganization: Function }) {
    const router = useRouter();
    const socialData = [...(socials ?? [])] as FormSocials[];
    const form = useForm();
    const [imgFile, setImgFile] = useState<File | string>();

    function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        setImgFile(event.target.files[0]);
    }

    const handleSubmit = form.handleSubmit(async (data) => {
        const image = data["Profile Image"][0];
        let socials: FormSocials[] = [];
        socialForms.forEach((social) =>
            socials.push({
                name: social.name,
                url: data[social.name],
            }),
        );
        const formData = new FormData();
        formData.append("imgFile", image);
        formData.append(
            "json",
            JSON.stringify({
                ...(id && {
                    id,
                }),
                name: data["Organization name"],
                username: data.Username,
                summary: data.Summary,
                socials,
            }),
        );
        const createOrUpdateOrg = await fetch("/api/organization", {
            method: id ? "PATCH" : "POST",
            body: formData,
        });
        if (createOrUpdateOrg.ok) {
            if (id) {
                toast.success("Organization updated", {
                    id: "org",
                });
            } else {
                toast.success("Organization created", {
                    id: "org",
                });
            }
            const organization = await createOrUpdateOrg.json();
            const { data } = organization;
            setSelectedOrganization(data);
            router.refresh();
        } else {
            const error = await createOrUpdateOrg.json();
            console.log(error);
            const errorFields = (await error.error.meta.target) as string[];
            errorFields.forEach((field: string) => {
                const fieldError =
                    field.charAt(0).toUpperCase() + field.slice(1);
                form.setError(fieldError, {
                    type: "uniqueConstraint",
                    message: `${fieldError} already registered.`,
                });
                form.setFocus(fieldError);
            });
        }
    });

    const name_validation: FormContext = {
        name: "Organization name",
        type: "text",
        placeholder: "Organization name",
        value: name ?? "",
        required: {
            value: true,
            message: "This field is required",
        },
    };
    const username_validation: FormContext = {
        name: "Username",
        type: "text",
        placeholder: "Your organization slug",
        value: username ?? "",
        required: {
            value: true,
            message: "This field is required",
        },
    };
    const image_validation: FormContext & RegisterOptions = {
        name: "Profile Image",
        type: "file",
        placeholder: "Your organization slug",
        required: {
            value: !image ? true : false,
            message: !image ? "This field is required" : "",
        },
        onChange: handleImage,
    };
    const summary_validation: FormContext = {
        name: "Summary",
        type: "textarea",
        placeholder: "Your organization's summary",
        value: summary ?? "",
        required: {
            value: false,
            message: "",
        },
    };

    const socialForms: FormContext[] = [
        {
            name: "Twitter username",
            type: "text",
            placeholder: "Your twitter username",
            value:
                socialData.find((social) => social.name === "Twitter username")
                    ?.url ?? "",
            required: {
                value: false,
                message: "",
            },
        },
        {
            name: "GitHub username",
            type: "text",
            placeholder: "Your github username",
            value:
                socialData.find((social) => social.name === "GitHub username")
                    ?.url ?? "",
            required: {
                value: false,
                message: "",
            },
        },
        {
            name: "Website URL",
            type: "text",
            placeholder: "Your website URL",
            value:
                socialData.find((social) => social.name === "Website URL")
                    ?.url ?? "",
            required: {
                value: false,
                message: "",
            },
        },
    ];
    return (
        <>
            <FormProvider {...form}>
                <div className="shadow-lg p-12 rounded-md space-y-2">
                    <h3 className="text-2xl font-bold">
                        {id ? "Update Organization" : "Create an Organization"}
                    </h3>
                    <Input {...name_validation} />
                    <Input {...username_validation} />
                    <div className="flex items-center gap-2">
                        {(imgFile || image) && (
                            <div className="avatar">
                                <div className="w-24 mx-auto ring-1 ring-gray-200">
                                    <Image
                                        src={
                                            imgFile
                                                ? URL.createObjectURL(
                                                      imgFile as File,
                                                  )
                                                : image!
                                        }
                                        alt={
                                            name ?? "Pending Organization photo"
                                        }
                                        height={50}
                                        width={50}
                                    />
                                </div>
                            </div>
                        )}
                        <Input {...image_validation} />
                    </div>
                    <Input {...summary_validation} />
                    {socialForms.length !== 0 &&
                        socialForms.map((social) => (
                            <Fragment key={social.name}>
                                <Input {...social} />
                            </Fragment>
                        ))}
                </div>
            </FormProvider>
            <button className="btn btn-info w-full" onClick={handleSubmit}>
                {id ? "Update Organization" : "Create Organization"}
            </button>
        </>
    );
}
