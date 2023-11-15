import NextAuth from "next-auth"
import { authConfig } from "@/utils/authConfig"
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }