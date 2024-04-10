import VerifyEmailTemplate from "@/components/email/templates/verification";
import prisma from "@/db";
import { authConfig } from "@/utils/authConfig";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const baseUrl = url.origin;
        const code = url.searchParams.get("code");
        const verificationUrl = `${baseUrl}/verify/email/${code}`;
        const session = await getServerSession(authConfig);
        const user = await prisma.user.findUnique({
            where: {
                id: session?.user?.id,
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
