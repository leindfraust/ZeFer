import prisma from "@/db";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ userId: string }>;
}): Promise<Metadata> {
    const { userId } = await params;
    const userPostSeries = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: userId,
                },
                {
                    username: userId,
                },
            ],
        },
    });
    return {
        title: `${userPostSeries?.name}'s Series`,
        authors: [{ name: userPostSeries?.name as string }],
    };
}

export default async function SeriesUserPage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;

    const userPostSeries = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: userId,
                },
                {
                    username: userId,
                },
            ],
        },
        include: {
            series: {
                include: {
                    _count: {
                        select: {
                            posts: {
                                where: {
                                    published: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!userPostSeries) return notFound();

    return (
        <>
            <h1 className="text-2xl font-bold text-info mb-4">
                {userPostSeries.name}&apos;s Series
            </h1>
            <div className="flex flex-wrap gap-4">
                {userPostSeries &&
                    userPostSeries.series.map((series) => (
                        <Fragment key={series.id}>
                            <Link href={`/${userId}/series/${series.id}`}>
                                <div className="card card-compact w-72 bg-base-100 shadow-lg hover:outline outline-gray-400">
                                    <div className="card-body">
                                        <div className="flex">
                                            <h2 className="card-title flex-1">
                                                {series.title}
                                            </h2>
                                            <p className="text-md text-right">
                                                {series._count.posts} Posts
                                            </p>
                                        </div>
                                        <p>{series.description}</p>
                                    </div>
                                </div>
                            </Link>
                        </Fragment>
                    ))}
            </div>
        </>
    );
}
