import { Blog } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function BlogContainer({ id, coverImage, title, description, author, readPerMinute }: Blog) {
    return (<Link href={`/blog/${id}`} target="_blank">
        <div className="grid grid-cols-2 justify-center items-center p-6 border shadow-lg  rounded-lg">
            <div className="container mx-auto space-y-4 max-w-sm">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-lg">{description}</p>
                <p className="text-sm">{author} <strong>·</strong> {readPerMinute} min read</p>
            </div>
            <figure>
                <Image src={coverImage as string} alt="cover_image" width={1920} height={1080} className="float-right" />
            </figure>
        </div>
    </Link>)
}