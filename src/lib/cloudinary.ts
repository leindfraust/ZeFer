import cloudinarySignature from "@/utils/cloudinarySignature";

export async function uploadCloudinary(options: {
    file: FormDataEntryValue;
    folder: string;
    public_id: string;
    format?: "jpg" | "png";
}) {
    const timestamp = new Date().getTime();
    const formData = new FormData();
    const folder = `postdevfy/${options.folder}`;
    formData.append("file", options.file);
    formData.append("api_key", process.env.NEXT_CLOUDINARY_API as string);
    formData.append("folder", folder);
    formData.append("public_id", options.public_id);
    formData.append("format", options?.format ?? "jpg");
    formData.append("timestamp", timestamp.toString());
    formData.append(
        "signature",
        cloudinarySignature(
            options.public_id,
            process.env.NEXT_CLOUDINARY_SECRET as string,
            folder,
            timestamp,
        ),
    );
    const upload = await fetch(
        `http://api.cloudinary.com/v1_1/${
            process.env.NEXT_CLOUDINARY_NAME as string
        }/image/upload`,
        {
            method: "POST",
            body: formData,
        },
    );
    return {
        upload,
        metadata: {
            timestamp,
            folder,
            public_id: options.public_id,
        },
    };
}

export function getCloudinaryImage(options: {
    timestamp: number;
    public_id: string;
    folder: string;
}) {
    const image = `https://res.cloudinary.com/leindfraust/image/upload/v${options.timestamp}/${options.folder}/${options.public_id}.jpg`;
    return image;
}
