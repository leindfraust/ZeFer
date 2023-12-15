"use client";

import {
    faCheckCircle,
    faShareSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faShareSquare as faRegShareSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export function PostShareButton({
    userId,
    titleId,
}: {
    userId: string;
    titleId: string;
}) {
    const shareLink: string = `https://zefer.vercel.app/${userId}/${titleId}`;
    const [linkCopyStatus, setLinkCopyStatus] = useState<boolean>(false);
    const [postShareActed, setPostShareActed] = useState<boolean>(false);
    return (
        <>
            <div className="dropdown dropdown-left lg:dropdown-right">
                <div tabIndex={0}>
                    <FontAwesomeIcon
                        icon={postShareActed ? faShareSquare : faRegShareSquare}
                        title="Share"
                        className="cursor-pointer"
                    />
                </div>
                <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                    <li>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(shareLink);
                                    setLinkCopyStatus(true);
                                    setPostShareActed(true);
                                }}
                            >
                                {linkCopyStatus ? "Copied" : "Copy Link"}
                            </button>

                            {linkCopyStatus && (
                                <FontAwesomeIcon icon={faCheckCircle} />
                            )}
                        </div>
                    </li>
                    <li>
                        <a
                            onClick={() => setPostShareActed(true)}
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                            target="_blank"
                        >
                            Share to Facebook
                        </a>
                    </li>
                    <li>
                        <a
                            onClick={() => setPostShareActed(true)}
                            href={`https://twitter.com/intent/tweet?url=${shareLink}`}
                            target="_blank"
                        >
                            Share to Twitter
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}
