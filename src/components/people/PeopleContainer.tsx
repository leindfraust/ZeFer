"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function PeopleContainer({ name, username, image, id }: User) {
    return (
        <Link href={`/${username || id}`}>
            <div className="flex justify-center items-center gap-2">
                <div className="avatar">
                    <div className="w-16 rounded-full">
                        <Image
                            src={image}
                            width={70}
                            height={70}
                            alt={name as string}
                        />
                    </div>
                </div>
                <div className="container">
                    <h3 className="text-lg">{name}</h3>
                    {username && (
                        <p className="text-sm text-slate-400">@{username}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
