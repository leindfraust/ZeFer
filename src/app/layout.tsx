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
            ? new URL("https://zefer.vercel.app")
            : new URL("http://localhost:3000"),
    title: "ZeFer",
    description: "Tell your story to the world.",
    openGraph: {
        images: "/zefer-text-with-logo.svg",
    },
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
