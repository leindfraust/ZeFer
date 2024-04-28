import prisma from "@/db";
import { getCloudinaryImage, uploadCloudinary } from "@/lib/cloudinary";
import { authConfig } from "@/utils/authConfig";
import generateRandom4DigitNumber from "@/utils/randomNumberGen4Digit";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.formData();
    const img = body.get("imgFile");
    const json = JSON.parse(body.get("json") as string);
    const session = await getServerSession(authConfig);
    const { name, username, summary, socials } = json;
    console.log(img);
    console.log(name, username, summary, socials);
    try {
        if (!img) throw new Error("No image file found");
        const cloudinary = await uploadCloudinary({
            file: img,
            folder: "organization",
            public_id: `${session?.user.id}_${
                username ??
                name.replace(/\s/g, "").toLowerCase() +
                    generateRandom4DigitNumber()
            }`,
        });
        if (cloudinary.upload.ok) {
            const imageAddr = getCloudinaryImage({
                timestamp: cloudinary.metadata.timestamp,
                public_id: cloudinary.metadata.public_id,
                folder: cloudinary.metadata.folder,
            });
            const organization = await prisma.organization.create({
                data: {
                    name,
                    username,
                    image: imageAddr,
                    summary,
                    socials,
                    owner: {
                        connect: { id: session?.user.id },
                    },
                },
            });
            if (organization)
                return NextResponse.json(
                    { data: organization.name },
                    { status: 200 },
                );
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
