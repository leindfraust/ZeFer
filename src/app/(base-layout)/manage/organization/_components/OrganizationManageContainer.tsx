"use client";

import type { FormContext } from "@/types/formContext";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import Input from "@/components/ui/Input";
import { FormSocials } from "@/types/user";
import { Fragment } from "react";

export default function OrganizationManageContainer() {
    const form = useForm();

    const handleSubmit = form.handleSubmit(async (data) => {
        const image = data["Profile Image"];
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
                name: data["Organization name"],
                username: data.Username,
                summary: data.Summary,
                socials,
            }),
        );
        const createOrg = await fetch("/api/organization", {
            method: "POST",
            body: formData,
        });
        if (createOrg.ok) {
            // to do something here...
        } else {
            const error = await createOrg.json();
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
        required: {
            value: true,
            message: "This field is required",
        },
    };
    const username_validation: FormContext = {
        name: "Username",
        type: "text",
        placeholder: "Your organization slug",
        required: {
            value: true,
            message: "This field is required",
        },
    };
    const image_validation: FormContext = {
        name: "Profile Image",
        type: "file",
        placeholder: "Your organization slug",
        required: {
            value: true,
            message: "This field is required",
        },
    };
    const summary_validation: FormContext = {
        name: "Summary",
        type: "textarea",
        placeholder: "Your organization's summary",
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
            required: {
                value: false,
                message: "",
            },
        },
        {
            name: "GitHub username",
            type: "text",
            placeholder: "Your github username",
            required: {
                value: false,
                message: "",
            },
        },
        {
            name: "Website URL",
            type: "text",
            placeholder: "Your website URL",
            required: {
                value: false,
                message: "",
            },
        },
    ];
    return (
        <div className="container">
            <div className="mx-auto lg:w-9/12 justify-center space-y-6">
                <FormProvider {...form}>
                    <div className="shadow-lg p-12 rounded-md space-y-2">
                        <h3 className="text-2xl font-bold">
                            Create an Organization
                        </h3>
                        <Input {...name_validation} />
                        <Input {...username_validation} />
                        <Input {...image_validation} />
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
                    Create Organization
                </button>
            </div>
        </div>
    );
}
