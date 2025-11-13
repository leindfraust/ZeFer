"use client";

import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import type { BuiltInProviderType } from "next-auth/providers/index";

function SignInContent() {
    const [providers, setProviders] = useState<Record<
        LiteralUnion<BuiltInProviderType>,
        ClientSafeProvider
    > | null>(null);
    const [email, setEmail] = useState("");
    const searchParams = useSearchParams();

    // Helper function to sanitize callbackUrl and prevent redirect loops
    const sanitizeCallbackUrl = (url: string | null): string => {
        if (!url) return "/";

        try {
            // Decode the URL to handle encoded callbackUrls (may need multiple decodes)
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
            // Keep extracting until we find the innermost callbackUrl
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

            // Parse as URL to handle absolute URLs
            let parsedUrl: URL;
            try {
                parsedUrl = new URL(extractedUrl);
                extractedUrl = parsedUrl.pathname + parsedUrl.search;
            } catch {
                // If it's not a valid absolute URL, treat as relative
                try {
                    parsedUrl = new URL(extractedUrl, window.location.origin);
                    extractedUrl = parsedUrl.pathname + parsedUrl.search;
                } catch {
                    // If still fails, treat as relative path
                    extractedUrl = extractedUrl.startsWith("/")
                        ? extractedUrl
                        : `/${extractedUrl}`;
                }
            }

            // Remove any remaining callbackUrl parameters
            try {
                const urlObj = new URL(extractedUrl, window.location.origin);
                urlObj.searchParams.delete("callbackUrl");
                extractedUrl = urlObj.pathname + urlObj.search;
            } catch {
                // If URL parsing fails, manually remove callbackUrl param
                extractedUrl = extractedUrl.replace(
                    /[?&]callbackUrl=[^&]*/g,
                    "",
                );
            }

            // Prevent redirect loops - never redirect to signin or auth API routes
            if (
                extractedUrl.includes("/auth/signin") ||
                extractedUrl.includes("/api/auth/signin") ||
                extractedUrl === "/auth/signin" ||
                extractedUrl === "/api/auth/signin"
            ) {
                return "/";
            }

            return extractedUrl.startsWith("/") ? extractedUrl : "/";
        } catch {
            // If anything goes wrong, default to home
            return "/";
        }
    };

    const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    const handleEmailSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        signIn("email", { email, callbackUrl });
    };

    const getProviderIcon = (providerId: string) => {
        switch (providerId) {
            case "google":
                return faGoogle;
            case "github":
                return faGithub;
            default:
                return faEnvelope;
        }
    };

    const getProviderStyle = (providerId: string) => {
        switch (providerId) {
            case "google":
                return "btn-error";
            case "github":
                return "btn-neutral";
            default:
                return "btn-primary";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/zefer-text-with-logo.svg"
                            alt="ZeFer Logo"
                            width={180}
                            height={60}
                            priority
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-center text-base-content/60 mb-6">
                        Sign in to continue to ZeFer
                    </p>

                    {/* Email Sign In Form */}
                    {providers?.email && (
                        <form onSubmit={handleEmailSignIn} className="mb-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="input input-bordered"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4"
                            >
                                <FontAwesomeIcon icon={faEnvelope} />
                                Sign in with Email
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    {providers?.google || providers?.github ? (
                        <div className="divider">OR</div>
                    ) : null}

                    {/* OAuth Providers */}
                    <div className="space-y-3">
                        {providers?.google && (
                            <button
                                onClick={() =>
                                    signIn("google", { callbackUrl })
                                }
                                className={`btn ${getProviderStyle("google")} w-full`}
                            >
                                <FontAwesomeIcon
                                    icon={getProviderIcon("google")}
                                />
                                Continue with Google
                            </button>
                        )}
                        {providers?.github && (
                            <button
                                onClick={() =>
                                    signIn("github", { callbackUrl })
                                }
                                className={`btn ${getProviderStyle("github")} w-full`}
                            >
                                <FontAwesomeIcon
                                    icon={getProviderIcon("github")}
                                />
                                Continue with GitHub
                            </button>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-base-content/60">
                            By signing in, you agree to our{" "}
                            <Link href="/terms" className="link link-primary">
                                Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="link link-primary">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignIn() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-base-200">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            }
        >
            <SignInContent />
        </Suspense>
    );
}
