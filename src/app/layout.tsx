import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { TopLoader } from "@/components/TopLoader";
import ThemeProvider from "@/components/provider/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase:
        process.env.NODE_ENV === "production"
            ? new URL("https://zefer.blog")
            : new URL("http://localhost:3000"),
    title: "ZeFer, a publishing platform for developers and creatives alike to share their content or story.",
    applicationName: "ZeFer",
    description:
        "A dynamic publishing platform for developers and creatives to share their content or story to the world.",
    openGraph: {
        images: "/zefer-bg.svg",
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
                    <TopLoader />
                </Suspense>
                <Toaster position="top-center" gutter={24} />
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
