import { verifyEmail } from "@/utils/actions/verification";
import { notFound } from "next/navigation";

export default async function EmailVeritification({
    params,
}: {
    params: { code: string };
}) {
    const { code } = params;
    if (!code) notFound();
    const verify = await verifyEmail(code);

    return (
        <div className="mt-12 mb-12 mr-4 ml-4 lg:mr-28 lg:ml-28 mx-auto space-y-4">
            {verify ? (
                <>
                    <h1 className="text-4xl font-bold">
                        Congratulations, your email has been verified.
                    </h1>
                    <p className="text-xl">You may close this window.</p>
                </>
            ) : (
                <>
                    <h1 className="text-4xl font-bold">
                        Something went wrong, please try again.
                    </h1>
                    <p className="text-xl">
                        The verification code is invalid or has expired.
                    </p>
                </>
            )}
        </div>
    );
}
