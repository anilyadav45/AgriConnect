"use client"

import Link from "next/link"
import { Camera, CloudRain, BarChart3, BookOpen, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Header from "@/components/header"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <Header />

      <section className="p-4 bg-green-600 text-white">
        <h2 className="text-lg font-medium">नमस्ते, {user?.name || "किसान"}!</h2>
        <p className="text-sm opacity-90">आज का मौसम: धूप ☀️ | फसल: गेहूं</p>
      </section>

      <section className="flex-1 p-4 grid grid-cols-2 gap-4">
        <Link href="/disease-detection">
          <div className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center justify-center h-full border-2 border-green-100 hover:border-green-500 transition-colors">
            <Camera className="h-10 w-10 text-green-600 mb-2" />
            <span className="text-center text-sm font-medium">रोग पहचान</span>
            <span className="text-center text-xs text-gray-500">Disease Detection</span>
          </div>
        </Link>

        <Link href="/weather">
          <div className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center justify-center h-full border-2 border-green-100 hover:border-green-500 transition-colors">
            <CloudRain className="h-10 w-10 text-blue-600 mb-2" />
            <span className="text-center text-sm font-medium">मौसम</span>
            <span className="text-center text-xs text-gray-500">Weather</span>
          </div>
        </Link>

        <Link href="/market-prices">
          <div className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center justify-center h-full border-2 border-green-100 hover:border-green-500 transition-colors">
            <BarChart3 className="h-10 w-10 text-orange-600 mb-2" />
            <span className="text-center text-sm font-medium">बाज़ार भाव</span>
            <span className="text-center text-xs text-gray-500">Market Prices</span>
          </div>
        </Link>

        <Link href="/knowledge">
          <div className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center justify-center h-full border-2 border-green-100 hover:border-green-500 transition-colors">
            <BookOpen className="h-10 w-10 text-purple-600 mb-2" />
            <span className="text-center text-sm font-medium">ज्ञान</span>
            <span className="text-center text-xs text-gray-500">Knowledge</span>
          </div>
        </Link>

        <Link href="/community" className="col-span-2">
          <div className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center justify-center h-full border-2 border-green-100 hover:border-green-500 transition-colors">
            <Users className="h-10 w-10 text-teal-600 mb-2" />
            <span className="text-center text-sm font-medium">समुदाय</span>
            <span className="text-center text-xs text-gray-500">Community</span>
          </div>
        </Link>
      </section>

      <footer className="bg-green-700 text-white p-2 text-center text-xs">
        <p>© 2025 AgriConnect | Offline Mode Active</p>
      </footer>
    </main>
  )
}
