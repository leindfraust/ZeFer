import type { JSONContent } from "@tiptap/react"

type PostEdit = {
    postId: string
    title: string
    description: string
    content: JSONContent
    tags: string[]
    coverImage: string
}

type PostView = {
    userId: string
    createdAt: Date
}

type PostReaction = {
    userId: string,
    type: 'thumbs up' | 'heart',
    createdAt: Date
}

type PostComment = {
    userId: string,
    message: string,
    createdAt: string,
    updatedAt: string,
    replies: PostCommentReply[]
}

type PostCommentReply = {
    userId: string,
    message: string,
    sort: number,
    createdAt: string,
    updatedAt: string
}

export type { PostEdit, PostView, PostReaction, PostComment }