"use client";
import { PostDraft } from "@prisma/client";
import { Organization } from "@prisma/client";
import React, { useState } from "react";
import Tiptap from "../wysiwyg/Tiptap";
interface SelectedOrg {
    orgName: string;
    org?: Organization | null;
}
const PostTypeSelector = ({
    userId,
    username,
    tags,
    editOrDraft,
    mode,
    orgs,
    ownOrg,
}: {
    userId?: string;
    username?: string | null | undefined;
    tags: string[];
    editOrDraft?: PostDraft;
    mode?: "edit" | "draft";
    orgs?: Organization[];
    ownOrg?: Organization[];
}) => {
    const combinedOrgs = [...(orgs ?? []), ...(ownOrg ?? [])];
    const [selectOrg, setSelectOrg] = useState<SelectedOrg>({
        orgName: "",
    });
    const [selectTipTap, setSelectTipTap] = useState(false);
    return (
        <>
            {selectTipTap || combinedOrgs.length === 0 ? (
                <Tiptap
                    userId={userId}
                    username={username}
                    editOrDraft={editOrDraft}
                    mode={mode}
                    tags={tags}
                    selectedOrg={selectOrg.org ?? null}
                />
            ) : (
                <div className="flex md:flex-row flex-col w-full  justify-center gap-20 mt-40 items-center md:items-stretch">
                    <div className="card card-compact md:w-96 w-72 bg-base-100 shadow-xl py-5">
                        <div className="card-body">
                            <h3 className="card-title">
                                Promote Your Business or Cause
                            </h3>
                            <p>
                                Create engaging content to share your
                                organization&apos;s updates, insights, and
                                events. Connect with your professional audience
                                and enhance your brand&apos;s presence.
                            </p>
                            <div className="dropdown">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn m-1"
                                >
                                    {selectOrg?.orgName
                                        ? selectOrg.orgName
                                        : "Choose Organization"}
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                >
                                    {combinedOrgs?.map((org) => (
                                        <li
                                            key={org.id}
                                            onClick={() =>
                                                setSelectOrg({
                                                    org: org,
                                                    orgName: org.name,
                                                })
                                            }
                                        >
                                            <p>{org.name}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card-actions justify-end">
                                <button
                                    className="btn btn-primary"
                                    disabled={selectOrg?.orgName === ""}
                                    onClick={() => setSelectTipTap(true)}
                                >
                                    Start Posting
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card card-compact  md:w-96 w-72  bg-base-100 shadow-xl py-5">
                        <div className="card-body">
                            <h2 className="card-title">Post for Personal</h2>
                            <p>
                                Express your thoughts, experiences, and personal
                                updates. Connect with friends, family, and
                                followers on a more intimate level.
                            </p>
                            <div className="card-actions justify-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setSelectOrg({
                                            orgName: "",
                                            org: null,
                                        });
                                        setSelectTipTap(true);
                                    }}
                                >
                                    Start Posting
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostTypeSelector;
