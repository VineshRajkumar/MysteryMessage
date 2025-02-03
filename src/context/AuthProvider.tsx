//Using the supplied <SessionProvider> allows instances of useSession() to share the session object across components
// It also takes care of keeping the session updated and synced between tabs/windows.
//SessionProvider code is also taken from next-auth docs
'use client'

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({children}:{children: React.ReactNode}){  //:{children: React.ReactNode} this is added here because it is a typescript file so to avoid typeerror
  return (
    <SessionProvider> {children} </SessionProvider>
  )
}