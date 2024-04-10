"use server";

import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authConfig } from "../authConfig";
import { init } from "@paralleldrive/cuid2";

export const generateVerificationCode = async () => {
    const createKey = init({
        length: 48,
    });
    const session = await getServerSession(authConfig);
    const existingVerificationCode =
        await prisma.emailVerificationCode.findUnique({
            where: {
                userId: session?.user.id,
            },
        });
    if (existingVerificationCode) {
        await prisma.emailVerificationCode.delete({
            where: {
                id: existingVerificationCode.id,
            },
        });
    }
    const code = await prisma.emailVerificationCode.create({
        data: {
            user: {
                connect: {
                    id: session?.user.id,
                },
            },
            key: createKey(),
        },
    });
    if (code) return code.key;
    return null;
};

export const verifyEmail = async (code: string) => {
    const session = await getServerSession(authConfig);
    const verify = await prisma.emailVerificationCode.findUnique({
        where: {
            key: code,
            userId: session?.user.id,
        },
    });
    if (verify) {
        await prisma.user.update({
            where: {
                id: session?.user.id,
            },
            data: {
                emailVerified: new Date(),
            },
        });
        await prisma.emailVerificationCode.delete({
            where: { userId: session?.user.id },
        });
        return true;
    }
    return false;
};

export const getCurrentEmailVerificationCodeDate = async () => {
    const session = await getServerSession(authConfig);
    const code = await prisma.emailVerificationCode.findUnique({
        where: {
            userId: session?.user.id,
        },
    });
    if (code) {
        return code.createdAt;
    } else {
        return null;
    }
};
