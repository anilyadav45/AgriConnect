import type React from "react"
;('"use client')

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Leaf } from "lucide-react"

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  })
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.phone || !loginData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Use the updated login function that checks registered users
      const success = await login(loginData.phone, loginData.password)

      if (success) {
        router.push("/")
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid phone number or password. Please use registered credentials or create a new account.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-green-600 text-white rounded-full p-3 mb-4">
            <Leaf className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">AgriConnect</h1>
          <p className="text-green-600 mt-1">किसानों के लिए एक डिजिटल साथी</p>
        </div>

        <Card className="w-full">
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">फ़ोन नंबर</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="अपना फ़ोन नंबर दर्ज करें"
                value={loginData.phone}
                onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">पासवर्ड</Label>
                <Link href="/forgot-password" className="text-xs text-green-600 hover:underline">
                  पासवर्ड भूल गए?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="अपना पासवर्ड दर्ज करें"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>डेमो के लिए, डिफ़ॉल्ट लॉगिन: फ़ोन: 9876543210, पासवर्ड: password123</p>
            </div>
          </form>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2025 AgriConnect | सभी अधिकार सुरक्षित</p>
        </div>
      </div>
    </main>
  )
}
