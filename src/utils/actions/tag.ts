"use server";

import { authConfig } from "@/utils/authConfig";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getTagRankings() {
    const tagsRanking = await prisma.tagsRanking.findFirst({
        orderBy: {
            createdAt: "desc",
        },
        take: 1,
    });
    return tagsRanking?.data.slice(0, 10);
}

export async function updateInterest(tag: string) {
    const session = await getServerSession(authConfig);
    try {
        const getUser = await prisma.user.findUnique({
            where: {
                id: session?.user.id,
            },
        });
        //if user hasn't followed the tag
        const ifNotFollowing = getUser?.interests.filter(
            (interest: string) => interest === tag,
        );
        if (ifNotFollowing?.length === 0) {
            const updateUser = await prisma.user.update({
                where: {
                    id: session?.user.id,
                },
                data: {
                    interests: {
                        push: tag,
                    },
                },
            });
            if (updateUser) return "following";
        }
        // unfollow tag
        const newInterests = [
            ...(getUser?.interests as string[]).filter(
                (interest) => interest !== tag,
            ),
        ];
        const updateUser = await prisma.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                interests: newInterests,
            },
        });
        if (updateUser) return "unfollowing";
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function ifTagFollowing(tag: string) {
    const session = await getServerSession(authConfig);
    const tagFollowed = await prisma.user.findUnique({
        where: {
            id: session?.user.id,
            interests: {
                has: tag,
            },
        },
    });
    if (tagFollowed) return true;
    return false;
}

export async function validateTag(tag: string) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are a helpful assistant and I want you to validate the following keyword for tag creation. Follow the rules: 1. A tag must not contain any malicious word in any languages. 2. You will only output true or false. Now validate the tag: ${tag}`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
    if (text?.toLowerCase().includes("true")) return true;
    return false;
}
