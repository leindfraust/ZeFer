"use client";

import { UserSocials } from "@/types/user";
import { useRouter } from "next/navigation";
import { FormContext } from "@/types/formContext";
import { FormProvider, RegisterOptions, useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import { Fragment, useEffect, useState } from "react";
import { User } from "@prisma/client";
import DisplayImage from "./DisplayImage";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
    generateVerificationCode,
    getCurrentEmailVerificationCodeDate,
} from "@/utils/actions/verification";

export default function ProfileSettingsComponent({
    username,
    name,
    bio,
    address,
    occupation,
    email,
    emailVerified,
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
    const [initialVerificationCodeSent, setInitialVerificationCodeSent] =
        useState<boolean>(false);
    const [isVerificationCodeSent, setIsVerificationCodeSent] =
        useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const [countdown, setCountdown] = useState<number>(60);
    useEffect(() => {
        async function getCurrentCode() {
            const currentEmailVerificationCode =
                await getCurrentEmailVerificationCodeDate();
            if (currentEmailVerificationCode) {
                const expectedCountdown =
                    new Date(currentEmailVerificationCode).getTime() + 60000;
                const remainingCountdown = Math.round(
                    (new Date(expectedCountdown).getTime() -
                        new Date().getTime()) /
                        1000,
                );
                if (remainingCountdown > 0) {
                    setIsVerificationCodeSent(true);
                    setCountdown(remainingCountdown);
                }
            }
        }
        getCurrentCode();
    }, []);

    async function sendVerificationCode() {
        setIsSending(true);
        if (!initialVerificationCodeSent) setInitialVerificationCodeSent(true);
        if (!isVerificationCodeSent) {
            const generateCode = await generateVerificationCode();
            if (generateCode) {
                const params = new URLSearchParams({
                    code: generateCode,
                });
                const response = await fetch(
                    `/api/email/send/verification?${params}`,
                    {
                        method: "POST",
                    },
                );
                if (response.ok) {
                    setIsVerificationCodeSent(true);
                    toast.success("Verification code sent to your email.");
                    setTimeout(() => {
                        setIsVerificationCodeSent(false);
                    }, 60000);
                    setCountdown(60);
                }
            }
        }
        setIsSending(false);
    }

    useEffect(() => {
        if (isVerificationCodeSent) {
            if (countdown > 0) {
                setTimeout(() => setCountdown(countdown - 1), 1000);
            } else {
                setIsVerificationCodeSent(false);
            }
        }
    }, [countdown, isVerificationCodeSent]);

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
        placeholder: emailVerified ? email! : "Your email",
        value: email ? email : "",
        required: {
            value: true,
            message: "This field is required",
        },
        disabled: emailVerified ? true : false,
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
            toast.success("Profile information has been updated.", {
                id: "profile",
            });
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
                        {!emailVerified && (
                            <div role="alert" className="alert alert-error">
                                <FontAwesomeIcon icon={faExclamationCircle} />
                                <span>
                                    Your email has not been verified yet. Verify
                                    your email to keep your account secure.
                                </span>
                                <div>
                                    <button
                                        className="btn btn-sm"
                                        onClick={sendVerificationCode}
                                        disabled={
                                            isVerificationCodeSent || isSending
                                        }
                                    >
                                        {!isVerificationCodeSent ? (
                                            <>
                                                {!initialVerificationCodeSent
                                                    ? "Send Verification Code"
                                                    : isSending
                                                    ? "Processing..."
                                                    : "Resend Verification Code"}
                                            </>
                                        ) : (
                                            <>{`Try again in ${countdown}s`}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        <Input {...username_validation} />
                        <Input {...name_validation} />
                        <Input {...bio_validation} />
                        <Input {...address_validation} />
                        <Input {...occupation_validation} />
                        <Input {...email_validation} />
                        {emailVerified && (
                            <div role="alert" className="alert alert-success">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Email is verified.</span>
                            </div>
                        )}
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
