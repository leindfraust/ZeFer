import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db";
import { JSONContent } from "@tiptap/react";
import cloudinarySignature from "@/lib/cloudinarySignature";
//Promise<any> is a temporary fix
export async function POST(req: NextRequest): Promise<any> {
    const body = await req.formData()
    const image_total = body.get('image_total') ? body.get('image_total') as unknown as number : 0 as number
    const images = () => {
        let imageFiles: FormDataEntryValue[] = []
        if (image_total < 0) {
            for (let i = 0; i < image_total; i++) {
                const image = body.get(`image_${i}`)
                if (image) {
                    imageFiles.push(image)
                }
            }
        }
        return imageFiles
    }

    try {
        const session = await getServerSession(authConfig)
        const blog = await prisma.blog.create({
            data: {
                title: body.get('title') as string,
                description: body.get('description') as string,
                series: body.get('series') as string,
                content: JSON.parse(body.get('content') as string),
                readPerMinute: parseInt(body.get('readPerMinute') as string),
                user: {
                    connect: { id: session?.user.id }
                }
            },
            select: {
                id: true,
                content: true
            }
        })
        if (blog) { //upload coverImage
            const formData = new FormData()
            const folder = 'blogdevfy/blog'
            const timestamp = new Date().getTime();
            formData.append('file', body.get('coverImage') as File)
            formData.append('api_key', process.env.NEXT_CLOUDINARY_API as string)
            formData.append('folder', folder)
            formData.append('public_id', `${blog.id}_cover`)
            formData.append('format', 'jpg')
            formData.append('timestamp', timestamp.toString())
            formData.append('signature', cloudinarySignature(`${blog.id}_cover`, process.env.NEXT_CLOUDINARY_SECRET as string, folder, timestamp))
            const cloudinary = await fetch(`http://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_NAME as string}/image/upload/`, {
                method: 'POST',
                body: formData
            })
            if (cloudinary.ok) {
                const coverImage = await prisma.blog.update({
                    where: { id: blog.id },
                    data: {
                        coverImage: `https://res.cloudinary.com/leindfraust/image/upload/w_1920,h_1080,c_scale/v${timestamp}/${folder}/${blog.id}_cover.jpg` //always output coverImage of 1920 1080
                    }
                })
                if (coverImage && blog && image_total > 0) { //only upload if images are detected in the content
                    const id = blog.id
                    const content = blog.content as JSONContent
                    const contentImages = content.content?.filter(image => image.type === 'image') as JSONContent[]
                    const folder = 'blogdevfy/blog'
                    const timestamp = new Date().getTime();
                    const cloudinary = async () => {
                        let uploaded: boolean[] = []
                        for (const [index, image] of Object.entries(images())) {
                            const formData = new FormData()
                            formData.append('file', image)
                            formData.append('api_key', process.env.NEXT_CLOUDINARY_API as string)
                            formData.append('folder', folder)
                            formData.append('public_id', `${id}_${index}`)
                            formData.append('format', 'jpg')
                            formData.append('timestamp', timestamp.toString())
                            formData.append('signature', cloudinarySignature(`${id}_${index}`, process.env.NEXT_CLOUDINARY_SECRET as string, folder, timestamp))
                            const cloudinary = await fetch(`http://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_NAME as string}/image/upload`, {
                                method: 'POST',
                                body: formData
                            })
                            if (cloudinary.ok) {
                                uploaded.push(true)
                            }
                            return uploaded
                        }
                    }
                    if (await cloudinary()) {
                        if (Object.keys(await cloudinary() as unknown as string).length === Object.keys(images()).length && Object.keys(contentImages).length === Object.keys(await cloudinary() as unknown as string).length) {
                            if (contentImages) {
                                for (const [index, image] of Object.entries(contentImages)) {
                                    if (!image.attrs?.src) return
                                    image.attrs.src = `https://res.cloudinary.com/leindfraust/image/upload/v${timestamp}/${folder}/${id}_${index}.jpg`
                                }
                            }
                        }
                        const blog = await prisma.blog.update({
                            where: { id: id },
                            data: {
                                content: content
                            }
                        })
                        if (blog) return NextResponse.json({ status: 200 })
                    }
                } else {
                    if (blog) return NextResponse.json({ status: 200 })
                }
            }
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500 })
    }
}