import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { JSONContent } from "@tiptap/react";
import cloudinarySignature from "@/utils/cloudinarySignature";
import { Post } from "@prisma/client";
//Promise<any> is a temporary fix

export async function GET(req: NextRequest): Promise<any> {
    try {
        const url = new URL(req.url)
        const lastCursor = url.searchParams.get("cursor")
        const keyword = url.searchParams.get("q")?.split(" ").join("&")
        const tag = url.searchParams.get("tag")
        const userId = url.searchParams.get("userId")
        const published = url.searchParams.get("published")
        const orderBy = url.searchParams.get("orderBy") //either latest or most-popular
        interface PrismaQuery {
            include: {},
            where: {
                NOT: {},
                published: boolean;
                title?: {},
                description?: {},
                author?: {},
                tags?: {},
                OR?: [{}, {}],
            };
            orderBy?: {}
        }

        const prismaQuery: PrismaQuery = {
            include: {
                reactions: true,
                comments: true,
                views: true
            },
            where: {
                NOT: {
                    coverImage: null //this is a safety mechanism as that all posts requires a coverImage
                },
                published: published === 'true' ? true : published === 'false' ? false : true //strict checking of false so when published params is anything but true or false, it always returns true
            },
            //when orderBy is not defined as latest or most-popular, default to latest
            orderBy: {
                createdAt: 'desc'
            }
        }

        if (keyword) {
            prismaQuery.where = {
                ...prismaQuery.where,
                title: {
                    search: keyword
                },
                description: {
                    search: keyword
                },
                author: {
                    search: keyword
                }
            }
        }

        if (tag) {
            prismaQuery.where = {
                ...prismaQuery.where,
                tags: {
                    has: tag
                }
            }
        }

        if (userId) {
            prismaQuery.where = {
                ...prismaQuery.where,
                OR: [{
                    userId: userId
                },
                {
                    authorUsername: userId
                }]
            }
        }

        if (orderBy === 'latest') {
            prismaQuery.orderBy = {
                createdAt: 'desc'
            }
        }

        if (orderBy === 'most-popular') {
            prismaQuery.orderBy = {
                views: {
                    _count: 'desc'
                }
            }
        }

        const posts = await prisma.post.findMany({
            ...prismaQuery,
            ...(lastCursor && {
                skip: 1,
                cursor: {
                    id: lastCursor,
                }
            }),
            take: 1
        })


        if (posts.length === 0) {
            return NextResponse.json({
                data: [],
                metaData: {
                    lastCursor: null,
                    hasNextPost: false
                },
            }, { status: 200 })
        }

        const lastPost: Post = posts[posts.length - 1];
        const cursor: string = lastPost.id

        const nextPost = await prisma.post.findMany({
            ...prismaQuery,
            take: 1,
            skip: 1,
            cursor: {
                id: cursor
            }
        });

        const data = {
            data: posts,
            metaData: {
                lastCursor: cursor !== undefined ? cursor : null,
                hasNextPost: nextPost.length > 0
            }
        }

        return NextResponse.json({ data }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

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
    //create titleId for the Url
    function generateRandomCode() {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';

        for (let i = 0; i < 4; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }

        return code;
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
            await prisma.postDraft.delete({
                where: {
                    userId: session?.user.id
                }
            })
        }

        const post = await prisma.post.upsert({
            where: { id: (body.get('postId') as string) ?? '' },
            update: {
                title: (body.get('title') as string).trim(),
                description: (body.get('description') as string).trim(),
                tags: [...JSON.parse(body.get('tags') as string)],
                content: JSON.parse(body.get('content') as string),
                readPerMinute: parseInt(body.get('readPerMinute') as string),
                published: (body.get('published') as string) === 'true' ? true : false,
            },
            create: {
                title: (body.get('title') as string).trim(),
                titleId: `${(body.get('title') as string).replace(/[^a-zA-Z0-9 ]/g, "").trim().split(" ").join("-")}-${generateRandomCode()}`,
                description: (body.get('description') as string).trim(),
                tags: [...JSON.parse(body.get('tags') as string)],
                content: JSON.parse(body.get('content') as string),
                readPerMinute: parseInt(body.get('readPerMinute') as string),
                authorUsername: body.get('username') as string,
                published: (body.get('published') as string) === 'true' ? true : false,
                user: {
                    connect: { id: session?.user.id }
                }
            },
            select: {
                id: true,
                content: true,
                titleId: true
            }
        })
        //deletes the draft if new post has been inserted completely
        if (post && image_total === 0 && body.get('coverImage') === 'undefined') return NextResponse.json({ data: post.titleId }, { status: 200 }) //if no new images and cover images detected
        if (post && image_total > 0) { //only upload if images are detected in the content
            const content = post.content as JSONContent
            const contentImages = content.content?.filter(image => image.type === 'image') as JSONContent[]
            const folder = 'postdevfy/post'
            const timestamp = new Date().getTime();
            let uploaded: boolean[] = []
            for (const [index, image] of Object.entries(images())) {
                const formData = new FormData()
                formData.append('file', image)
                formData.append('api_key', process.env.NEXT_CLOUDINARY_API as string)
                formData.append('folder', folder)
                formData.append('public_id', `${post.id}_${index}`)
                formData.append('format', 'jpg')
                formData.append('timestamp', timestamp.toString())
                formData.append('signature', cloudinarySignature(`${post.id}_${index}`, process.env.NEXT_CLOUDINARY_SECRET as string, folder, timestamp))
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
                            image.attrs.src = `https://res.cloudinary.com/leindfraust/image/upload/v${timestamp}/${folder}/${post.id}_${index}.jpg`
                        }
                    }
                }
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        content: content
                    }
                })
            }
        }
        if (post && body.get('coverImage')) { //upload coverImage
            const formData = new FormData()
            const folder = 'postdevfy/post'
            const timestamp = new Date().getTime();
            formData.append('file', body.get('coverImage') as File)
            formData.append('api_key', process.env.NEXT_CLOUDINARY_API as string)
            formData.append('folder', folder)
            formData.append('public_id', `${post.id}_cover`)
            formData.append('format', 'jpg')
            formData.append('timestamp', timestamp.toString())
            formData.append('signature', cloudinarySignature(`${post.id}_cover`, process.env.NEXT_CLOUDINARY_SECRET as string, folder, timestamp))
            const cloudinary = await fetch(`http://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_NAME as string}/image/upload/`, {
                method: 'POST',
                body: formData
            })
            if (cloudinary.ok) {
                const coverImage = await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        coverImage: `https://res.cloudinary.com/leindfraust/image/upload/w_1920,h_1080,c_scale/v${timestamp}/${folder}/${post.id}_cover.jpg` //always output coverImage of 1920 1080
                    }
                })
                if (coverImage) return NextResponse.json({ data: post.titleId }, { status: 200 }) //return a response here since coverImage is REQUIRED.
            }
        }
        if (post) return NextResponse.json({ data: post.titleId }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 500 })
    }
}