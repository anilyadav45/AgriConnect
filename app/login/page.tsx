"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Leaf } from "lucide-react"
import { getRegisteredUsers } from "@/lib/utils"

export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Update the login handler to use the new authentication system

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.phone || !loginData.password) {
      toast({
        title: "त्रुटि",
        description: "कृपया सभी फ़ील्ड भरें",
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
          title: "लॉगिन विफल",
          description: "अमान्य फ़ोन नंबर या पासवर्ड। कृपया पंजीकृत विवरण दर्ज करें या नया खाता बनाएं।",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "लॉगिन विफल",
        description: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update the register handler to include password in user data

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !registerData.name ||
      !registerData.phone ||
      !registerData.password ||
      !registerData.confirmPassword ||
      !registerData.location
    ) {
      toast({
        title: "त्रुटि",
        description: "कृपया सभी फ़ील्ड भरें",
        variant: "destructive",
      })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "त्रुटि",
        description: "पासवर्ड मेल नहीं खाते",
        variant: "destructive",
      })
      return
    }

    if (registerData.phone.length < 10) {
      toast({
        title: "त्रुटि",
        description: "कृपया वैध फ़ोन नंबर दर्ज करें",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Check if phone number is already registered
      const users = getRegisteredUsers()
      const existingUser = users.find((user) => user.phone === registerData.phone)

      if (existingUser) {
        toast({
          title: "पंजीकरण विफल",
          description: "यह फ़ोन नंबर पहले से पंजीकृत है। कृपया लॉगिन करें या अन्य नंबर का उपयोग करें।",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      register({
        id: "", // Will be generated in the register function
        name: registerData.name,
        phone: registerData.phone,
        password: registerData.password, // Include password for authentication
        location: registerData.location,
      })

      toast({
        title: "पंजीकरण सफल",
        description: "आपका खाता सफलतापूर्वक बनाया गया है",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "पंजीकरण विफल",
        description: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">लॉगिन</TabsTrigger>
              <TabsTrigger value="register">पंजीकरण</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
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

                {/* Update the demo instructions text */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>डेमो के लिए, डिफ़ॉल्ट लॉगिन: फ़ोन: 9876543210, पासवर्ड: password123</p>
                  <p className="mt-1">या नया खाता पंजीकृत करें</p>
                </div>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">पूरा नाम</Label>
                  <Input
                    id="name"
                    placeholder="अपना नाम दर्ज करें"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone">फ़ोन नंबर</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="अपना फ़ोन नंबर दर्ज करें"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">पासवर्ड</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="पासवर्ड बनाएं"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">पासवर्ड की पुष्टि करें</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="पासवर्ड दोबारा दर्ज करें"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">स्थान</Label>
                  <Input
                    id="location"
                    placeholder="गांव/शहर, राज्य"
                    value={registerData.location}
                    onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "पंजीकरण हो रहा है..." : "पंजीकरण करें"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2025 AgriConnect | सभी अधिकार सुरक्षित</p>
        </div>
      </div>
    </main>
  )
}
