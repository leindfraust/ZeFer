import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import ThemeProvider from "@/components/provider/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "ZeFer";
const APP_DEFAULT_TITLE =
    "ZeFer, a publishing platform for developers and creatives alike.";
const APP_TITLE_TEMPLATE = "%s | ZeFer";
const APP_DESCRIPTION =
    "A dynamic publishing platform for developers and creatives to share their content or story to the world.";

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
    metadataBase:
        process.env.NODE_ENV === "production"
            ? new URL("https://zefer.blog")
            : new URL("http://localhost:3000"),
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
        images: "/zefer-bg.svg",
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    authors: [
        {
            name: "Romel Jr Zerna",
            url: "https://linktr.ee/leindfraust",
        },
        {
            name: "Mel Fatima Fernandez",
        },
    ],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
        startupImage: "/icons/512.png",
    },
    category: "",
    formatDetection: {
        telephone: false,
    },
    keywords: [
        "ZeFer",
        "blog",
        "publishing",
        "developers",
        "creatives",
        "content",
        "story",
        "zefer",
        "publishing platform",
        "blog posts",
        "posts",
        "creator",
        "content sharing",
        "story sharing",
        "content creator",
    ],
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider />
                <Suspense>
                    <NextTopLoader showSpinner={false} />
                </Suspense>
                <Toaster position="top-center" gutter={24} />
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
