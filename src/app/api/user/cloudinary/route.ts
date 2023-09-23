import { NextResponse } from "next/server";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import cloudinarySignature from "@/lib/cloudinarySignature";

export async function POST(req: Request) {
    const body = await req.formData()
    const img = body.get('imgFile') as Blob
    const id = body.get('id') as string

    const formData = new FormData()
    const timestamp = new Date().getTime();
    const folder = 'blogdevfy/user'
    formData.append('file', img)
    formData.append('api_key', process.env.NEXT_CLOUDINARY_API as string)
    formData.append('folder', folder)
    formData.append('public_id', id)
    formData.append('format', 'jpg')
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', cloudinarySignature(id, process.env.NEXT_CLOUDINARY_SECRET as string, folder, timestamp))

    try {
        const cloudinary = await fetch(`http://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_NAME as string}/image/upload`, {
            method: 'POST',
            body: formData
        })
        if (cloudinary.ok) {
            const session = await getServerSession(authConfig)
            const updateImage = await prisma.user.update({
                where: { id: session?.user.id },
                data: { image: `https://res.cloudinary.com/leindfraust/image/upload/v${timestamp}/${folder}/${session?.user.id}.jpg` }
            })
            if (updateImage) return NextResponse.json(cloudinary)
        }
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 })
    }
}