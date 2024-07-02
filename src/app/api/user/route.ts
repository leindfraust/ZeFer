import { NextResponse } from "next/server";
import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { User } from "@prisma/client";
//Promise<any> is a temporary fix
export async function GET(req: Request): Promise<any> {
    const url = new URL(req.url);
    const lastCursor = url.searchParams.get("cursor");
    const keyword = url.searchParams.get("q")?.split(" ").join("&");

    const prismaQuery = {
        where: {
            name: {
                search: keyword,
            },
            username: {
                search: keyword,
            },
            bio: {
                search: keyword,
            },
            address: {
                search: keyword,
            },
            occupation: {
                search: keyword,
            },
        },
    };

    try {
        const users = await prisma.user.findMany({
            ...prismaQuery,
            ...(lastCursor && {
                skip: 1,
                cursor: {
                    id: lastCursor,
                },
            }),
            take: 1,
        });

        if (users.length === 0) {
            return NextResponse.json(
                {
                    data: [],
                    metaData: {
                        lastCursor: null,
                        hasNextPost: false,
                    },
                },
                { status: 200 },
            );
        }

        const lastPost: User = users[users.length - 1];
        const cursor: string = lastPost.id;

        const nextPost = await prisma.user.findMany({
            ...prismaQuery,
            take: 1,
            skip: 1,
            cursor: {
                id: cursor,
            },
        });

        const data = {
            data: users,
            metaData: {
                lastCursor: cursor !== undefined ? cursor : null,
                hasNextPost: nextPost.length > 0,
            },
        };

        return NextResponse.json({ data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ err }, { status: 500 });
    }
}

export async function PATCH(req: Request): Promise<any> {
    const body = await req.json();
    const session = await getServerSession(authConfig);
    try {
        const user = await prisma.user.update({
            where: { id: session?.user.id },
            data: {
                ...body,
                ...(body.username && {
                    username: body.username.replace(/\s/g, ""),
                }),
            },
        });
        const updatePosts = await prisma.post.updateMany({
            where: { userId: session?.user.id },
            data: {
                author: body.name,
                authorUsername: body.username
                    ? body.username.replace(/\s/g, "")
                    : session?.user.id,
            },
        });
        if (user && updatePosts) {
            return NextResponse.json({ status: 200 });
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
