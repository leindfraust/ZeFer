import { Blog } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ id, coverImage, title, description }: Blog) {
    return (<Link href={`/blog/${id}`} target="_blank">
        <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <figure>
                <Image src={coverImage as string} alt="cover_image" width={1920} height={1080} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    </Link>)
}