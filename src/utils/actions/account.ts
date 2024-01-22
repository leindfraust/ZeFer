"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "../authConfig";
import prisma from "@/db";
import { init } from "@paralleldrive/cuid2";

export async function unlinkAccount(accountId: string, providerId: string) {
    const session = await getServerSession(authConfig);

    try {
        const linkedProviders = await prisma.account.count({
            where: { userId: session?.user.id },
        });
        if (linkedProviders > 1) {
            const unlinkProviderAccount = await prisma.account.delete({
                where: {
                    id: accountId,
                    providerAccountId: providerId,
                },
            });
            if (unlinkProviderAccount) return true;
        } else {
            throw new Error(
                "Cannot perform operation, user has only 1 linked account.",
            );
        }
    } catch (error) {
        return error;
    }
}

export async function deleteUser() {
    const session = await getServerSession(authConfig);
    try {
        const deleteUserAccount = await prisma.user.delete({
            where: { id: session?.user.id },
        });
        if (deleteUserAccount) return true;
    } catch (error) {
        return error;
    }
}

export async function generateApiKey(apiName: string) {
    const createdId = init({
        length: 48,
    });
    const apiKey = `sk-${createdId()}`;
    const session = await getServerSession(authConfig);
    const addApiKey = await prisma.apiKey.create({
        data: {
            name: apiName,
            key: apiKey,
            user: {
                connect: {
                    id: session?.user.id,
                },
            },
        },
    });
    if (addApiKey) return addApiKey;
}

export async function revokeApiKey(apiKeyId: string) {
    const session = await getServerSession(authConfig);
    const revokeApiKey = await prisma.apiKey.delete({
        where: {
            id: apiKeyId,
        },
    });
    if (revokeApiKey)
        return await prisma.apiKey.findMany({
            where: { ownerId: session?.user.id },
        });
}
