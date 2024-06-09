/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true,
    },
    async headers() {
        const env =
            process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV;
        const stagingUrl =
            process.env.NEXT_PUBLIC_VERCEL_URL.includes("staging") ||
            process.env.VERCEL_URL.includes("staging");
        const SOCKET = {
            prod: "https://melted-patience-leindfraust.koyeb.app/",
            staging: "https://zefer-socket.onrender.com/",
            dev: "http://localhost:5000",
        };
        console.log(env);
        console.log(stagingUrl);
        let URL = SOCKET.dev;
        if (env === "production") URL = SOCKET.prod;
        if (env === "development" || !!stagingUrl) URL = SOCKET.staging;
        return [
            {
                source: "/socket.io",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: URL },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, DELETE, PATCH, POST, PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/a/**",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/manage",
                destination: "/manage/posts",
                permanent: true,
            },
            {
                source: "/settings",
                destination: "/settings/profile",
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
    module.exports,
    {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during build
        silent: true,
        org: "romel-jr-zerna",
        project: "zefer",
    },
    {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: true,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
        tunnelRoute: "/monitoring",

        // Hides source maps from generated client bundles
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,
    },
);
