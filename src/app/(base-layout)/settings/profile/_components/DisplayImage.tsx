"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";

export default function DisplayImage({ image, name }: User) {
    const router = useRouter();
    const [imgFile, setImgFile] = useState<File | string>();
    const [imgUploading, setImgUploading] = useState(false);
    const [buttonChange, setButtonChange] = useState(false);

    function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;
        setImgFile(event.target.files[0]);
        setButtonChange(true);
    }

    function cancelImage() {
        setImgFile("");
        setButtonChange(false);
    }

    async function uploadImageCloudinary() {
        setImgUploading(true);
        const formData = new FormData();
        formData.append("imgFile", imgFile as string);
        const cloudinary = await fetch("/api/user/cloudinary", {
            method: "POST",
            body: formData,
        });
        if (cloudinary.ok) setButtonChange(false);
        setImgUploading(() => false);
        router.refresh();
    }

    return (
        <>
            <label className="label">Profile Image</label>
            <div className="flex items-center gap-2 mt-2">
                <div className="avatar">
                    <div
                        className={` w-12 rounded-full mx-auto ring ${
                            buttonChange ? "ring-warning" : ""
                        }`}
                    >
                        <Image
                            src={
                                imgFile
                                    ? URL.createObjectURL(imgFile as File)
                                    : image
                            }
                            alt={name as string}
                            height={50}
                            width={50}
                        />
                    </div>
                </div>
                <input
                    type="file"
                    className="file-input w-full max-w-xs"
                    id="fileImage"
                    onChange={handleImage}
                    accept="image/png, image/jpeg"
                />
                {buttonChange && (
                    <>
                        <div className="flex mx-auto space-x-4 p-4">
                            <button
                                className="btn btn-neutral"
                                onClick={cancelImage}
                                disabled={imgUploading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={uploadImageCloudinary}
                                disabled={imgUploading}
                            >
                                {imgUploading && (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                    </>
                                )}
                                Confirm
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
