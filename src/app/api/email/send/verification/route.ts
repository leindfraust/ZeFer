import VerifyEmailTemplate from "@/components/email/templates/verification";
import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const baseUrl = url.origin;
        const code = url.searchParams.get("code");
        const userId = url.searchParams.get("userId");
        const verificationUrl = `${baseUrl}/verify/email/${code}/${userId}`;
        if (!userId) throw new Error("No user id provided");
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (user?.email) {
            const data = await resend.emails.send({
                from: "ZeFer <verification@zefer.blog>",
                to: [user?.email],
                subject: "Verify your email.",
                react: VerifyEmailTemplate({
                    verificationUrl,
                }),
            });
            return NextResponse.json(data);
        } else return NextResponse.json({ message: "User not found" });
    } catch (error) {
        return NextResponse.json({ error });
    }
}
