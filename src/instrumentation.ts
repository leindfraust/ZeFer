import * as Sentry from "@sentry/nextjs";

export function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        Sentry.init({
            dsn: "https://d11d24a221ab5241ed52aa11667de2f9@o4506060501614592.ingest.sentry.io/4506200102207488",

            // Adjust this value in production, or use tracesSampler for greater control
            tracesSampleRate: 1,

            // Setting this option to true will print useful information to the console while you're setting up Sentry.
            debug: false,
            enabled: process.env.NODE_ENV === "production",
        });
    }

    if (process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: "https://d11d24a221ab5241ed52aa11667de2f9@o4506060501614592.ingest.sentry.io/4506200102207488",

            // Adjust this value in production, or use tracesSampler for greater control
            tracesSampleRate: 1,

            // Setting this option to true will print useful information to the console while you're setting up Sentry.
            debug: false,
            enabled: process.env.NODE_ENV === "production",
        });
    }
}
