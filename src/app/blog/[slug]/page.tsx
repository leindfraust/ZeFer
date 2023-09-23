import prisma from "@/db";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import type { JSONContent } from "@tiptap/react";
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import HighLight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import CharacterCount from '@tiptap/extension-character-count'
import { generateHTML } from "@tiptap/html";
import parse from 'html-react-parser'
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = params
    const blog = await prisma.blog.findUnique({
        where: { id: slug }
    })
    return {
        title: `${blog?.title} - ZeFer`,
        description: blog?.description,
        openGraph: { images: [blog?.coverImage as string] },
        authors: [{ name: blog?.author }]
    }
}


export default async function BlogPage({ params }: Params) {
    const { slug } = params
    const blog = await prisma.blog.findUnique({
        where: { id: slug }
    })
    if (!blog) return notFound()

    const blogContent = generateHTML(blog?.content as JSONContent, [TaskList, TaskItem, HighLight, StarterKit, TiptapImage, TiptapLink, Youtube, CharacterCount])
    return (<>
        <section className="min-h-screen prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto mt-12 mb-12 mr-12 ml-12 sm:mr-auto sm:ml-auto max-w-md focus:outline-none">
            <Image src={blog?.coverImage as string} height={1920} width={1080} alt="cover" />
            <div className="container -space-y-6">
                <h1>{blog?.title}</h1>
                <h4>{blog?.description}</h4>
            </div>
            <p><strong><Link href={`/user/${blog?.userId}`}>{blog?.author}</Link></strong> · {blog?.readPerMinute} min read</p>
            <div className="divider divider-vertical"></div>
            {parse(`
        ${blogContent} 
        `)}
        </section>
    </>)
}