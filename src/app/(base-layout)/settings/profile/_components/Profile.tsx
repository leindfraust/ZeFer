"use client";

import { UserSocials } from "@/types/user";
import { useRouter } from "next/navigation";
import { FormContext } from "@/types/formContext";
import { FormProvider, RegisterOptions, useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import { Fragment } from "react";
import { User } from "@prisma/client";
import DisplayImage from "./DisplayImage";

export default function ProfileSettingsComponent({
    username,
    name,
    bio,
    address,
    occupation,
    email,
    socials,
    id,
    image,
}: User) {
    const router = useRouter();
    const socialData = [...socials] as UserSocials[];
    const uploadImgProps = {
        id,
        image,
        name,
    } as User;

    const socialForms: FormContext[] = [
        {
            name: "Facebook",
            type: "text",
            placeholder: "Your facebook link",
            value: socialData.find((social) => social.name === "Facebook")?.url
                ? socialData.find((social) => social.name === "Facebook")?.url
                : "",
            required: {
                value: false,
                message: "",
            },
        },
        {
            name: "Twitter",
            type: "text",
            placeholder: "Your twitter link",
            value: socialData.find((social) => social.name === "Twitter")?.url
                ? socialData.find((social) => social.name === "Twitter")?.url
                : "",
            required: {
                value: false,
                message: "",
            },
        },
        {
            name: "Personal Website",
            type: "text",
            placeholder: "Your personal website link",
            value: socialData.find(
                (social) => social.name === "Personal Website",
            )?.url
                ? socialData.find((social) => social.name === "Personal Webite")
                      ?.url
                : "",
            required: {
                value: false,
                message: "",
            },
        },
    ];
    const form = useForm();

    const username_validation: RegisterOptions & FormContext = {
        name: "Username",
        type: "text",
        placeholder: "Your unique username",
        value: username ? username : "",
        required: {
            value: false,
            message: "This field is not required",
        },
        onChange: (e) =>
            form.setValue("Username", e.target.value.replace(/\s/g, "")),
    };

    const name_validation: FormContext = {
        name: "Name",
        type: "text",
        placeholder: "Your display name",
        value: name ? name : "",
        required: {
            value: true,
            message: "This field is required",
        },
    };

    const bio_validation: FormContext = {
        name: "Bio",
        type: "textarea",
        value: bio ? bio : "",
        placeholder: "Describe who you are...",
        required: {
            value: false,
            message: "",
        },
    };

    const address_validation: FormContext = {
        name: "Address",
        type: "text",
        placeholder: "Your address",
        value: address ? address : "",
        required: {
            value: false,
            message: "",
        },
    };

    const email_validation: FormContext = {
        name: "Email",
        type: "text",
        placeholder: "Your email",
        value: email ? email : "",
        required: {
            value: true,
            message: "This field is required",
        },
    };

    const occupation_validation: FormContext = {
        name: "Occupation",
        type: "text",
        placeholder: "Your job right now...",
        value: occupation ? occupation : "",
        required: {
            value: false,
            message: "",
        },
    };

    const updateDetails = form.handleSubmit(async (data) => {
        let socials: UserSocials[] = [];
        socialForms.forEach((social) =>
            socials.push({
                name: social.name,
                url: data[social.name],
            }),
        );
        const update = await fetch("/api/user", {
            method: "PATCH",
            body: JSON.stringify({
                username: data.Username,
                name: data.Name,
                bio: data.Bio,
                address: data.Address,
                occupation: data.Occupation,
                email: data.Email,
                socials: socials,
            }),
        });
        if (update.ok) {
            router.refresh();
        } else {
            const error = await update.json();
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

    return (
        <>
            <div className="mx-auto lg:w-9/12 justify-center space-y-6">
                <FormProvider {...form}>
                    <div className="shadow-lg p-12 rounded-md space-y-2">
                        <h3 className="text-2xl font-bold">
                            Profile Information
                        </h3>
                        <Input {...username_validation} />
                        <Input {...name_validation} />
                        <Input {...bio_validation} />
                        <Input {...address_validation} />
                        <Input {...occupation_validation} />
                        <Input {...email_validation} />
                        <DisplayImage {...uploadImgProps} />
                    </div>
                    <div className="shadow-lg p-12 rounded-md space-y-2">
                        <h3 className="text-2xl font-bold">Social Links</h3>
                        {socialForms.length !== 0 &&
                            socialForms.map((social) => (
                                <Fragment key={social.name}>
                                    <Input {...social} />
                                </Fragment>
                            ))}
                    </div>
                </FormProvider>
                <button className="btn btn-info w-full" onClick={updateDetails}>
                    Update Profile Information
                </button>
            </div>
        </>
    );
}
