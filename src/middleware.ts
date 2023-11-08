export { default } from "next-auth/middleware"

export const config = { matcher: ["/new", "/:userId/:titleId/edit", "/settings/:path*", "/manage/:path*", "/api/post/manage/:path*", "/api/user/cloudinary/:path*"] }