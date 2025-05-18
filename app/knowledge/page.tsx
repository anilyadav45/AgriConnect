"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, BookOpen, Clock, Eye, Download, Filter, Info, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock knowledge categories
const mockCategories = [
  {
    id: 1,
    name: "फसल तकनीक",
    icon: "🌾",
    count: 45,
  },
  {
    id: 2,
    name: "जल प्रबंधन",
    icon: "💧",
    count: 28,
  },
  {
    id: 3,
    name: "मिट्टी प्रबंधन",
    icon: "🌱",
    count: 32,
  },
  {
    id: 4,
    name: "कीट नियंत्रण",
    icon: "🐛",
    count: 36,
  },
  {
    id: 5,
    name: "फसल सुरक्षा",
    icon: "🛡️",
    count: 24,
  },
  {
    id: 6,
    name: "वित्तीय सुरक्षा",
    icon: "💰",
    count: 18,
  },
]

// Mock knowledge articles
const mockArticles = [
  {
    id: 1,
    title: "गेहूं की उन्नत खेती तकनीक",
    description: "गेहूं की फसल के लिए आधुनिक तकनीकों और बीजों की जानकारी",
    category: "फसल तकनीक",
    readTime: "5 मिनट",
    views: 1250,
    image: "/placeholder.svg?height=150&width=250",
    isSaved: true,
    isNew: true,
  },
  {
    id: 2,
    title: "जल संरक्षण के 10 तरीके",
    description: "कम पानी में अधिक उपज प्राप्त करने के लिए जल प्रबंधन तकनीकें",
    category: "जल प्रबंधन",
    readTime: "8 मिनट",
    views: 980,
    image: "/placeholder.svg?height=150&width=250",
    isSaved: false,
    isNew: false,
  },
  {
    id: 3,
    title: "मिट्टी की जांच कैसे करें",
    description: "घर पर ही मिट्टी की गुणवत्ता और पोषक तत्वों की जांच के तरीके",
    category: "मिट्टी प्रबंधन",
    readTime: "6 मिनट",
    views: 845,
    image: "/placeholder.svg?height=150&width=250",
    isSaved: true,
    isNew: false,
  },
  {
    id: 4,
    title: "फसल बीमा: किसानों के लिए मार्गदर्शिका",
    description: "फसल बीमा के प्रकार, लाभ और आवेदन प्रक्रिया की विस्तृत जानकारी",
    category: "वित्तीय सुरक्षा",
    readTime: "10 मिनट",
    views: 720,
    image: "/placeholder.svg?height=150&width=250",
    isSaved: false,
    isNew: true,
  },
  {
    id: 5,
    title: "जैविक कीटनाशक बनाने की विधि",
    description: "घरेलू सामग्री से प्रभावी जैविक कीटनाशक बनाने के तरीके",
    category: "कीट नियंत्रण",
    readTime: "7 मिनट",
    views: 1120,
    image: "/placeholder.svg?height=150&width=250",
    isSaved: false,
    isNew: false,
  },
  {
    id: 6,
    title: "फसल चक्र: उपज बढ़ाने का प्राकृतिक तरीका",
    description: "मिट्टी की उर्वरता बनाए रखने और उपज बढ़ाने के लिए फसल चक्र का महत्व",
    category: "फसल तकनीक",
    readTime: "9 मिनट",
    views: 890,
    image: "/placeholder.svg?height=150&width=250",
    isSaved: false,
    isNew: false,
  },
]

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const { toast } = useToast()

  // Filter articles based on search query and selected category
  const filteredArticles = mockArticles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === null ||
        mockCategories.find((cat) => cat.id === selectedCategory)?.name === article.category),
  )

  // Handle save article
  const handleSaveArticle = (id: number) => {
    toast({
      title: "लेख सहेजा गया",
      description: "यह लेख ऑफलाइन पढ़ने के लिए सहेजा गया है।",
      duration: 3000,
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">ज्ञान (Knowledge)</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Search and filter section */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="लेख खोजें..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Categories section */}
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-2">श्रेणियां</h3>
          <div className="grid grid-cols-3 gap-2">
            {mockCategories.map((category) => (
              <Card
                key={category.id}
                className={`p-2 cursor-pointer hover:border-green-300 transition-colors ${
                  selectedCategory === category.id ? "border-2 border-green-500" : ""
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl">{category.icon}</span>
                  <p className="text-xs font-medium mt-1">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.count} लेख</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured article */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">विशेष लेख</h3>
          <Card className="p-0 overflow-hidden">
            <div className="relative w-full h-40">
              <Image src="/placeholder.svg?height=300&width=600" alt="Featured article" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Badge className="bg-green-500 text-white hover:bg-green-600">फसल तकनीक</Badge>
                <h2 className="text-white font-bold mt-1">कम पानी में अधिक उपज: आधुनिक सिंचाई तकनीकें</h2>
                <p className="text-white/80 text-sm mt-1">जानिए कैसे आधुनिक सिंचाई तकनीकें आपकी फसल की उपज बढ़ा सकती हैं</p>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  12 मिनट पढ़ने में
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  2,450 बार देखा गया
                </span>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2" onClick={() => handleSaveArticle(0)}>
                <Download className="h-3 w-3 mr-1" />
                सहेजें
              </Button>
            </div>
          </Card>
        </div>

        {/* Articles list */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">सभी लेख</h3>
            <Link href="/knowledge/saved">
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-green-700">
                सहेजे गए लेख
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="space-y-3">
              {filteredArticles.map((article) => (
                <Link key={article.id} href={`/knowledge/${article.id}`}>
                  <Card className="p-3 hover:border-green-300 transition-colors">
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="rounded-md object-cover"
                        />
                        {article.isNew && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl-md rounded-tr-md">
                            नया
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                          {article.category}
                        </Badge>
                        <h3 className="font-medium mt-1 text-sm">{article.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{article.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleSaveArticle(article.id)
                            }}
                          >
                            <Download className={`h-3 w-3 ${article.isSaved ? "text-green-500" : "text-gray-400"}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">कोई लेख नहीं मिला</p>
              <p className="text-sm text-gray-400">कृपया अपनी खोज बदलें या फिल्टर हटाएं</p>
            </div>
          )}
        </div>

        {/* Offline mode notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-auto">
          <p className="text-xs text-yellow-800 flex items-center gap-1">
            <Info className="h-4 w-4" />
            ऑफलाइन मोड: आप सहेजे गए लेख देख सकते हैं। ताज़ा सामग्री के लिए इंटरनेट से कनेक्ट करें।
          </p>
        </div>
      </div>
    </main>
  )
}
