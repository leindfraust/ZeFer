// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://d11d24a221ab5241ed52aa11667de2f9@o4506060501614592.ingest.sentry.io/4506200102207488",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
    enabled: process.env.NODE_ENV === "production",

    replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0.1,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
        Sentry.feedbackIntegration({
            // Additional SDK configuration goes in here, for example:
            colorScheme: "system",
        }),
        Sentry.replayIntegration({
            // Additional Replay configuration goes in here, for example:
            maskAllText: true,
            blockAllMedia: true,
        }),
        Sentry.rewriteFramesIntegration(),
    ],
});
