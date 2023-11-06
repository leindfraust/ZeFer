import prisma from "@/db"
import cloudinarySignature from "@/utils/cloudinarySignature"
import { JSONContent } from "@tiptap/react"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authConfig } from "../../auth/[...nextauth]/route"

export async function POST(req: NextRequest): Promise<any> {
    const body = await req.formData()
    const image_total = body.get('image_total') ? body.get('image_total') as unknown as number : 0 as number
    const images = () => {
        let imageFiles: FormDataEntryValue[] = []
        if (image_total > 0) {
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
        const pastDraft = await prisma.user.findUnique({
            where: { id: session?.user.id },
            select: {
                draft: true
            }
        })
        if (pastDraft?.draft) {
            await prisma.user.update({
                where: {
                    id: session?.user.id
                },
                data: {
                    draft: {
                        delete: true
                    }
                }
            })
        }
        const userDraftUpdate = await prisma.user.update({
            where: { id: session?.user.id },
            data: {
                draft: {
                    connectOrCreate: {
                        where: {
                            userId: session?.user.id
                        },
                        create: {
                            title: (body.get('title') as string).trim(),
                            description: (body.get('description') as string).trim(),
                            tags: [...JSON.parse(body.get('tags') as string)],
                            content: JSON.parse(body.get('content') as string),
                        },
                    }
                }
            },
            select: {
                draft: true
            }
        })
        const draft = userDraftUpdate.draft
        if (draft && image_total === 0 && body.get('coverImage') === 'undefined') return NextResponse.json({ status: 200 }) //if no new images and cover images detected
        if (draft && image_total > 0) { //only upload if images are detected in the content
            const content = draft.content as JSONContent
            const contentImages = content.content?.filter(image => image.type === 'image') as JSONContent[]
            const folder = 'zefer/post/draft'
            const timestamp = new Date().getTime();
            let uploaded: boolean[] = []
            for (const [index, image] of Object.entries(images())) {
                const formData = new FormData()
                formData.append('file', image)
                formData.append('api_key', process.env.NEXT_CLOUDINARY_API as string)
                formData.append('folder', folder)
                formData.append('public_id', `${draft.id}_${index}`)
                formData.append('format', 'jpg')
                formData.append('timestamp', timestamp.toString())
                formData.append('signature', cloudinarySignature(`${draft.id}_${index}`, process.env.NEXT_CLOUDINARY_SECRET as string, folder, timestamp))
                const cloudinary = await fetch(`http://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_NAME as string}/image/upload`, {
                    method: 'POST',
                    body: formData
                })
                if (cloudinary.ok) {
                    uploaded.push(true)
                }
            }
            if (uploaded) {
                if (Object.keys(uploaded as unknown as string).length === Object.keys(images()).length && Object.keys(contentImages).length === Object.keys(uploaded as unknown as string).length) {
                    if (contentImages) {
                        for (const [index, image] of Object.entries(contentImages)) {
                            if (!image.attrs?.src) return
                            image.attrs.src = `https://res.cloudinary.com/leindfraust/image/upload/v${timestamp}/${folder}/${draft.id}_${index}.jpg`
                        }
                    }
                }
                await prisma.postDraft.update({
                    where: { id: draft.id },
                    data: {
                        content: content
                    }
                })
            }
        }
        if (draft && body.get('coverImage')) { //upload coverImage
            const formData = new FormData()
            const folder = 'zefer/post/draft'
            const timestamp = new Date().getTime();
            formData.append('file', body.get('coverImage') as File)
            formData.append('api_key', process.env.NEXT_CLOUDINARY_API as string)
            formData.append('folder', folder)
            formData.append('public_id', `${draft.id}_cover`)
            formData.append('format', 'jpg')
            formData.append('timestamp', timestamp.toString())
            formData.append('signature', cloudinarySignature(`${draft.id}_cover`, process.env.NEXT_CLOUDINARY_SECRET as string, folder, timestamp))
            const cloudinary = await fetch(`http://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_NAME as string}/image/upload/`, {
                method: 'POST',
                body: formData
            })
            if (cloudinary.ok) {
                const coverImage = await prisma.postDraft.update({
                    where: { id: draft.id },
                    data: {
                        coverImage: `https://res.cloudinary.com/leindfraust/image/upload/w_1920,h_1080,c_scale/v${timestamp}/${folder}/${draft.id}_cover.jpg` //always output coverImage of 1920 1080
                    }
                })
                if (coverImage) return NextResponse.json({ status: 200 }) //return a response here since coverImage is REQUIRED.
            }
        }
        if (draft) return NextResponse.json({ status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 500 })
    }
}