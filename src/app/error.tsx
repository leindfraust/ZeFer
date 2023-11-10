'use client' // Error components must be Client Components

import { useEffect } from 'react'
import * as Sentry from "@sentry/nextjs";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        Sentry.captureException(error)
    }, [error])

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-screen">
                    <h1 className="text-5xl font-bold">Oops! Something went wrong. Contact us or try again later.</h1>
                    <p className="py-6 text-error">{error.message}</p>
                    <button className="btn btn-primary" onClick={() => reset()}>Reload this page</button>
                </div>
            </div>
        </div>
    )
}