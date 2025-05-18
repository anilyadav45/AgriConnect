"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import HomePage from "@/components/home-page"
import LoginPage from "@/components/login-page"

export default function Home() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4 text-green-800">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  // Show home page if authenticated, otherwise show login page
  return isAuthenticated ? <HomePage /> : <LoginPage />
}
