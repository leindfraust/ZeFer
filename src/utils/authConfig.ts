import prisma from "@/db";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import generateRandom4DigitNumber from "./randomNumberGen4Digit";
import EmailProvider from "next-auth/providers/email";

export const authConfig: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT as unknown as number,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.RESEND_API_KEY,
                },
            },
            from: "no-reply@zefer.blog",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    username:
                        profile.given_name.replace(/\s/g, "").toLowerCase() +
                        generateRandom4DigitNumber(),
                };
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name ?? profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    username:
                        profile.login.replace(/\s/g, "").toLowerCase() +
                        generateRandom4DigitNumber(),
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),
        redirect: ({ url, baseUrl }) => {
            try {
                // Decode URL to handle encoded callbackUrls (may need multiple decodes)
                let decodedUrl = url;
                let previousUrl = "";
                let decodeAttempts = 0;

                // Keep decoding until no more changes (handles multiple levels of encoding)
                while (decodedUrl !== previousUrl && decodeAttempts < 10) {
                    previousUrl = decodedUrl;
                    try {
                        decodedUrl = decodeURIComponent(decodedUrl);
                    } catch {
                        break;
                    }
                    decodeAttempts++;
                }

                // Extract actual destination from nested callbackUrl parameters
                let extractedUrl = decodedUrl;
                let extractionAttempts = 0;
                while (
                    extractedUrl.includes("callbackUrl=") &&
                    extractionAttempts < 10
                ) {
                    // Try to match callbackUrl parameter (handles both encoded and decoded)
                    const match = extractedUrl.match(/[?&]callbackUrl=([^&]+)/);
                    if (match) {
                        try {
                            extractedUrl = decodeURIComponent(match[1]);
                        } catch {
                            extractedUrl = match[1];
                        }
                    } else {
                        break;
                    }
                    extractionAttempts++;
                }

                // Parse the URL
                let parsedUrl: URL;
                try {
                    parsedUrl = new URL(extractedUrl);
                } catch {
                    // If relative, make absolute
                    parsedUrl = new URL(extractedUrl, baseUrl);
                }

                // Remove callbackUrl parameters to prevent nesting
                parsedUrl.searchParams.delete("callbackUrl");
                const cleanPath = parsedUrl.pathname + parsedUrl.search;

                // Prevent redirect loops - never redirect to signin or auth API routes
                if (
                    cleanPath.includes("/auth/signin") ||
                    cleanPath.includes("/api/auth/signin") ||
                    cleanPath === "/auth/signin" ||
                    cleanPath === "/api/auth/signin"
                ) {
                    return baseUrl;
                }

                // If url is relative, make it absolute
                if (extractedUrl.startsWith("/")) {
                    return `${baseUrl}${cleanPath}`;
                }

                // If url is on same origin, allow it (with cleaned path)
                if (parsedUrl.origin === baseUrl) {
                    return `${baseUrl}${cleanPath}`;
                }

                // Default to baseUrl for external URLs
                return baseUrl;
            } catch (error) {
                // If anything goes wrong, default to baseUrl
                return baseUrl;
            }
        },
    },
    theme: {
        logo: "/zefer.svg",
    },
    pages: {
        signIn: "/auth/signin",
        newUser: "/settings/profile",
    },
};
