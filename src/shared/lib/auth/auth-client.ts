import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: (import.meta.env.VITE_APP_URL as string) || "http://localhost:3377",
})

export const { signIn, signUp, signOut, useSession } = authClient
