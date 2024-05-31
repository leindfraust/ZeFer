"use server";

import prisma from "@/db";
import { init } from "@paralleldrive/cuid2";
import { getServerSession } from "next-auth";
import { authConfig } from "../authConfig";

export async function rerollSecretKey(organizationId: string) {
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });
    if (!organization) {
        throw new Error("Organization not found");
    }
    const createdId = init({
        length: 48,
    });
    const apiKey = `sk-${createdId()}`;
    await prisma.organization.update({
        where: {
            id: organizationId,
        },
        data: {
            secret: apiKey,
        },
    });
    return apiKey;
}

export async function joinOrganizationWithSK(secret: string) {
    const session = await getServerSession(authConfig);
    const checkIfOrganizationjExists = await prisma.organization.findUnique({
        where: { secret },
    });
    if (!checkIfOrganizationjExists) {
        return {
            status: false,
            message: "Organization does not exist.",
        };
    }
    const checkIfAlreadyJoined = await prisma.user.findUnique({
        where: {
            id: session?.user.id,
            OR: [
                {
                    ownedOrganizations: {
                        some: {
                            secret,
                        },
                    },
                },
                {
                    organizations: {
                        some: {
                            secret,
                        },
                    },
                },
            ],
        },
    });
    if (checkIfAlreadyJoined)
        return {
            status: false,
            message: "You are already a member of this organization.",
        };
    const joinOrganization = await prisma.organization.update({
        where: {
            secret,
        },
        data: {
            members: {
                connect: {
                    id: session?.user.id,
                },
            },
        },
        include: {
            owner: true,
            admins: true,
            members: true,
        },
    });
    return {
        status: true,
        message: "You have successfully joined the organization.",
        organization: joinOrganization,
    };
}

export async function addAdmin(organizationId: string, adminId: string) {
    const session = await getServerSession(authConfig);
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });
    if (!organization) throw new Error("Organization not found");

    const isOwner = organization.ownerId === session?.user.id;
    if (!isOwner) throw new Error("Not authorized");
    const newAdmins = await prisma.organization.update({
        where: { id: organizationId },
        data: {
            admins: {
                connect: {
                    id: adminId,
                },
            },
        },
        include: {
            admins: true,
        },
    });
    if (newAdmins) return newAdmins;
}

export async function addMember(organizationId: string, memberId: string) {
    const session = await getServerSession(authConfig);
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        include: {
            admins: true,
        },
    });
    if (!organization) throw new Error("Organization not found");
    const isOwner = organization.ownerId === session?.user.id;
    const isAdmin = organization.admins.some(
        (admin) => admin.id === session?.user.id,
    );
    if (!isOwner || !isAdmin) throw new Error("Not authorized");
    const newMembers = await prisma.organization.update({
        where: { id: organizationId },
        data: {
            members: {
                connect: {
                    id: memberId,
                },
            },
        },
        select: {
            members: true,
        },
    });
    if (newMembers) return newMembers;
}

export async function removeAdmin(organizationId: string, adminId: string) {
    const session = await getServerSession(authConfig);
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
    });
    if (!organization) {
        throw new Error("Organization not found");
    }
    const isOwner = organization.ownerId === session?.user.id;
    if (!isOwner) throw new Error("Not authorized");
    const newAdmins = await prisma.organization.update({
        where: { id: organizationId },
        data: {
            admins: {
                disconnect: {
                    id: adminId,
                },
            },
            members: {
                connect: {
                    id: adminId,
                },
            },
        },
        select: {
            admins: true,
        },
    });
    if (newAdmins) return newAdmins;
}

export async function removeMember(organizationId: string, memberId: string) {
    const session = await getServerSession(authConfig);
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        include: { admins: true },
    });
    if (!organization) {
        throw new Error("Organization not found");
    }
    const isOwner = organization.ownerId === session?.user.id;
    const isAdmin = organization.admins.some(
        (admin) => admin.id === session?.user.id,
    );
    if (!isOwner || !isAdmin) throw new Error("Not authorized");
    const newMembers = await prisma.organization.update({
        where: { id: organizationId },
        data: {
            members: {
                disconnect: {
                    id: memberId,
                },
            },
        },
        select: {
            members: true,
        },
    });
    if (newMembers) return newMembers;
}


export async function getOrg (orgId:string | null){
    if(!orgId){
        return ;
    }
    const org = await prisma.organization.findUnique({
        where:{
            id:orgId
        },
        select:{
            name:true,
            image:true,
        }
    })
    if(org)return org
}
