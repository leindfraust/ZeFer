import prisma from "@/db";
import { getCloudinaryImage, uploadCloudinary } from "@/lib/cloudinary";
import { authConfig } from "@/utils/authConfig";
import generateRandom4DigitNumber from "@/utils/randomNumberGen4Digit";
import { init } from "@paralleldrive/cuid2";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.formData();
    const img = body.get("imgFile");
    const json = JSON.parse(body.get("json") as string);
    const session = await getServerSession(authConfig);
    const { name, username, summary, socials } = json;
    try {
        if (!img) throw new Error("No image file found");
        const checkUsername = await prisma.organization.findUnique({
            where: {
                username,
            },
        });
        if (checkUsername) throw new Error("Username already taken");
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
            const createdId = init({
                length: 48,
            });
            const apiKey = `sk-${createdId()}`;
            const organization = await prisma.organization.create({
                data: {
                    secret: apiKey,
                    name,
                    username,
                    image: imageAddr,
                    summary,
                    socials,
                    owner: {
                        connect: { id: session?.user.id },
                    },
                },
                include: {
                    owner: true,
                    admins: true,
                    members: true,
                },
            });
            return NextResponse.json({ data: organization }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.formData();
    const img = body.get("imgFile");
    const json = JSON.parse(body.get("json") as string);
    const session = await getServerSession(authConfig);
    const { id, name, username, summary, socials } = json;
    try {
        let imageAddr: string = "";
        if (img) {
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
                imageAddr = getCloudinaryImage({
                    timestamp: cloudinary.metadata.timestamp,
                    public_id: cloudinary.metadata.public_id,
                    folder: cloudinary.metadata.folder,
                });
            }
        }
        const organization = await prisma.organization.update({
            where: { id },
            data: {
                name,
                ...(imageAddr && {
                    image: imageAddr,
                }),
                username,
                summary,
                socials,
            },
            include: {
                owner: true,
                admins: true,
                members: true,
            },
        });
        return NextResponse.json({ data: organization }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
