export { default } from "next-auth/middleware"

export const config = { matcher: ["/blog/new", "/blog/edit"] }