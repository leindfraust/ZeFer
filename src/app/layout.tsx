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
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
                <NextTopLoader showSpinner={false} />
                <TopLoader />
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
