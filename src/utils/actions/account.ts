"use server"

import { getServerSession } from "next-auth";
import { authConfig } from "../authConfig";
import prisma from "@/db";

export async function unlinkAccount(accountId: string, providerId: string) {

    const session = await getServerSession(authConfig)

    try {
        const linkedProviders = await prisma.account.count({
            where: { userId: session?.user.id }
        })
        if (linkedProviders > 1) {
            const unlinkProviderAccount = await prisma.account.delete({
                where: {
                    id: accountId,
                    providerAccountId: providerId
                }
            })
            if (unlinkProviderAccount) return true
        } else {
            throw new Error('Cannot perform operation, user has only 1 linked account.')
        }
    } catch (error) {
        return error
    }
}

export async function deleteUser() {
    const session = await getServerSession(authConfig)
    try {
        const deleteUserAccount = await prisma.user.delete({
            where: { id: session?.user.id }
        })
        if (deleteUserAccount) return true
    } catch (error) {
        return error
    }
}