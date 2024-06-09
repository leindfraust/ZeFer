"use client";

import type { Organization, User } from "@prisma/client";
import { Fragment, useCallback, useEffect, useState } from "react";
import OrganizationManageCreateContainer from "./OrganizationManageCreateContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import {
    addAdmin,
    addMember,
    removeAdmin,
    removeMember,
    rerollSecretKey,
} from "@/utils/actions/organization";

export default function OrganizationManageContainer({
    organizations,
    sessionUserId,
}: {
    organizations: (Organization & {
        admins: User[];
        members: User[];
        owner: User;
    })[];
    sessionUserId: string;
}) {
    const [selectedOrganization, setSelectedOrganization] = useState<
        | (Organization & {
              admins: User[];
              members: User[];
              owner: User;
          })
        | undefined
    >(organizations[0]);
    const [userRole, setUserRole] = useState<"Owner" | "Admin" | "Member">();

    const checkIfAdmin = useCallback(() => {
        const isAdmin = selectedOrganization?.admins?.find(
            (admin) => admin.id === sessionUserId,
        );
        if (isAdmin) return true;
        return false;
    }, [selectedOrganization, sessionUserId]);

    const checkIfOwner = useCallback(() => {
        const isOwner = selectedOrganization?.ownerId === sessionUserId;
        if (isOwner) return true;
        return false;
    }, [selectedOrganization, sessionUserId]);

    const checkIfMember = useCallback(() => {
        const isMember = selectedOrganization?.members?.find(
            (member) => member.id === sessionUserId,
        );
        if (isMember) return true;
        return false;
    }, [selectedOrganization, sessionUserId]);

    useEffect(() => {
        if (!sessionUserId || !selectedOrganization) return;
        const isOwner = checkIfOwner();
        const isAdmin = checkIfAdmin();
        const isMember = checkIfMember();
        if (isOwner) setUserRole("Owner");
        if (isAdmin) setUserRole("Admin");
        if (isMember) setUserRole("Member");
    }, [
        checkIfAdmin,
        checkIfMember,
        checkIfOwner,
        organizations,
        selectedOrganization,
        sessionUserId,
    ]);

    async function rerollSk() {
        if (!selectedOrganization || !sessionUserId) return;
        const secret = await rerollSecretKey(selectedOrganization.id);
        if (secret) {
            setSelectedOrganization({
                ...selectedOrganization,
                secret,
            });
            toast.success("Successfully generated a new secret key!", {
                id: "org",
            });
        }
    }
    async function promoteToAdmin({ id, name }: User) {
        if (!selectedOrganization || !sessionUserId || !id) return;
        const isUserAdmin = selectedOrganization?.admins?.find(
            (admin) => admin.id === id,
        );
        if (isUserAdmin)
            toast.error("Already an Admin", {
                id: "org",
            });
        if (!isUserAdmin) {
            const newMembers = await removeMember(selectedOrganization?.id, id);
            if (newMembers) {
                const newAdmins = await addAdmin(selectedOrganization.id, id);
                if (newAdmins) {
                    setSelectedOrganization({
                        ...selectedOrganization,
                        admins: newAdmins.admins,
                        members: newMembers.members,
                    });
                    toast.success(
                        <span>
                            Successfully added <b>{name}</b> as an Admin.
                        </span>,
                        {
                            id: "org",
                        },
                    );
                }
            }
        }
    }

    async function demoteToMember({ id, name }: User) {
        if (!selectedOrganization || !sessionUserId || !id) return;
        const isUserMember = selectedOrganization?.members.find(
            (member) => member.id === id,
        );
        if (isUserMember)
            toast.error("Already a Member", {
                id: "org",
            });
        if (!isUserMember) {
            const newAdmins = await removeAdmin(selectedOrganization?.id, id);
            if (newAdmins) {
                const newMembers = await addMember(selectedOrganization.id, id);
                if (newMembers) {
                    setSelectedOrganization({
                        ...selectedOrganization,
                        admins: newAdmins.admins,
                        members: newMembers.members,
                    });
                    toast.success(
                        <span>
                            Successfully demoted <b>{name}</b> as a Member.
                        </span>,
                        {
                            id: "org",
                        },
                    );
                }
            }
        }
    }

    // async function addOrgMmeber({ id, name }: User) {
    //     if (!selectedOrganization || !sessionUserId || id) return;
    //     const newMembers = await addMember(selectedOrganization?.id, id);
    //     if (newMembers) {
    //         setSelectedOrganization({
    //             ...selectedOrganization,
    //             members: newMembers.members,
    //         });
    //         toast.success(
    //             <span>
    //                 Successfully added <b>{name}</b> as a Member.
    //             </span>,
    //             {
    //                 id: "org",
    //             },
    //         );
    //     }
    // }

    async function removeOrgAdmin({ id, name }: User) {
        if (!selectedOrganization || !sessionUserId || id) return;
        const newAdmins = await removeAdmin(selectedOrganization?.id, id);
        if (newAdmins) {
            setSelectedOrganization({
                ...selectedOrganization,
                admins: newAdmins.admins,
            });
            toast.success(
                <span>
                    Successfully removed <b>{name}</b> as an Admin.
                </span>,
                {
                    id: "org",
                },
            );
        }
    }

    async function removeOrgMember({ id, name }: User) {
        if (!selectedOrganization || !sessionUserId || id) return;
        const newMembers = await removeMember(selectedOrganization?.id, id);
        if (newMembers) {
            setSelectedOrganization({
                ...selectedOrganization,
                members: newMembers.members,
            });
            toast.success(
                <span>
                    Successfully removed <b>{name}</b> as a Member.
                </span>,
                {
                    id: "org",
                },
            );
        }
    }

    return (
        <>
            {selectedOrganization && (
                <>
                    <div className="flex items-center justify-between mb-2 flex-wrap md:flex-nowrap gap-4 md:gap-0">
                        <div className="w-full flex justify-center md:justify-start">
                            <select
                                className="select select-bordered font-bold text-lg w-full max-w-xs"
                                value={selectedOrganization.id}
                                onChange={(e) =>
                                    setSelectedOrganization(
                                        organizations.find(
                                            (organization) =>
                                                organization.id ===
                                                e.currentTarget.value,
                                        )!,
                                    )
                                }
                            >
                                {organizations.map((organization) => (
                                    <option
                                        key={organization.id}
                                        value={organization.id}
                                    >
                                        {organization.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full flex md:justify-end justify-center">
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    setSelectedOrganization(undefined)
                                }
                            >
                                Create or Join an Organization
                            </button>
                        </div>
                    </div>
                    <div className="shadow-lg p-12 rounded-md space-y-2">
                        <div className="space-y-4">
                            <div className="container">
                                <h3 className="text-2xl font-bold">Members</h3>
                                <div className="overflow-x-auto md:overflow-hidden">
                                    <table className="table table-lg">
                                        <tbody>
                                            <tr>
                                                <th className=" text-xl">
                                                    {
                                                        selectedOrganization
                                                            .owner.name
                                                    }
                                                </th>
                                                <td>
                                                    <span
                                                        className={
                                                            "badge badge-neutral"
                                                        }
                                                    >
                                                        OWNER (
                                                        {userRole === "Owner" &&
                                                            "YOU"}
                                                        )
                                                    </span>
                                                </td>
                                                <td></td>
                                            </tr>
                                            {selectedOrganization.admins.map(
                                                (admin) => (
                                                    <Fragment key={admin.id}>
                                                        <tr>
                                                            <th className="text-xl">
                                                                {admin.name}
                                                            </th>
                                                            <td>
                                                                <span
                                                                    className={
                                                                        "badge badge-error"
                                                                    }
                                                                >
                                                                    ADMIN
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="flex justify-end items-center gap-4">
                                                                    {userRole ===
                                                                        "Owner" && (
                                                                        <>
                                                                            <button
                                                                                className="btn btn-xs btn-outline btn-error"
                                                                                onClick={() =>
                                                                                    removeOrgAdmin(
                                                                                        admin,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                            <div className="dropdown dropdown-left">
                                                                                <label
                                                                                    tabIndex={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    <FontAwesomeIcon
                                                                                        icon={
                                                                                            faEllipsis
                                                                                        }
                                                                                        className="cursor-pointer"
                                                                                        size="lg"
                                                                                    />
                                                                                </label>
                                                                                <ul
                                                                                    tabIndex={
                                                                                        0
                                                                                    }
                                                                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                                                                >
                                                                                    <li>
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                demoteToMember(
                                                                                                    admin,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Demote
                                                                                            to
                                                                                            Member
                                                                                        </button>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </Fragment>
                                                ),
                                            )}
                                            {selectedOrganization.members.map(
                                                (member) => (
                                                    <Fragment key={member.id}>
                                                        <tr>
                                                            <th className="text-xl">
                                                                {member.name}
                                                            </th>
                                                            <td>
                                                                <span
                                                                    className={
                                                                        "badge badge-primary"
                                                                    }
                                                                >
                                                                    MEMBER
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="flex justify-end items-center gap-4">
                                                                    {userRole ===
                                                                        "Admin" ||
                                                                        (userRole ===
                                                                            "Owner" && (
                                                                            <>
                                                                                <button
                                                                                    className="btn btn-xs btn-outline btn-error"
                                                                                    onClick={() =>
                                                                                        removeOrgMember(
                                                                                            member,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                                <div className="dropdown dropdown-left">
                                                                                    <label
                                                                                        tabIndex={
                                                                                            0
                                                                                        }
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faEllipsis
                                                                                            }
                                                                                            className="cursor-pointer"
                                                                                            size="lg"
                                                                                        />
                                                                                    </label>
                                                                                    <ul
                                                                                        tabIndex={
                                                                                            0
                                                                                        }
                                                                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                                                                    >
                                                                                        <li>
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    promoteToAdmin(
                                                                                                        member,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                Promote
                                                                                                to
                                                                                                Admin
                                                                                            </button>
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                            </>
                                                                        ))}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </Fragment>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="container">
                                <h3 className="text-2xl font-bold">
                                    Invite some members with your secret key!
                                </h3>
                                <div className="flex justify-start">
                                    <div className="join mt-4">
                                        <input
                                            className="input input-bordered join-item w-full"
                                            value={selectedOrganization.secret}
                                        />
                                        <button
                                            className="btn join-item rounded-r-full bg-transparent"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    selectedOrganization.secret,
                                                );
                                                toast.success(
                                                    "Secret key copied",
                                                    {
                                                        id: "orgKey",
                                                    },
                                                );
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faClipboard}
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div className=" divider divider-vertical"></div>
                                <div className="flex justify-start items-center mt-4 gap-4 flex-wrap">
                                    <button
                                        className="btn btn-neutral"
                                        onClick={rerollSk}
                                    >
                                        Generate new secret key
                                    </button>
                                    <p className=" text-lg text-red-600">
                                        Reroll this regularly!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <OrganizationManageCreateContainer
                {...selectedOrganization}
                setSelectedOrganization={setSelectedOrganization}
                key={selectedOrganization?.id}
            />
        </>
    );
}
