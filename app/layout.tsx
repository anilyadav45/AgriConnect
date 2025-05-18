import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AgriAssistant from "@/components/agri-assistant"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgriConnect",
  description: "Connecting farmers with knowledge and resources",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <AgriAssistant />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
