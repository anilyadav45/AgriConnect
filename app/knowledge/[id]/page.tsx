"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, ThumbsUp, MessageSquare, Info, VolumeIcon, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Mock article data
const mockArticle = {
  id: 1,
  title: "गेहूं की उन्नत खेती तकनीक",
  description: "गेहूं की फसल के लिए आधुनिक तकनीकों और बीजों की जानकारी",
  category: "फसल तकनीक",
  readTime: "5 मिनट",
  views: 1250,
  likes: 86,
  comments: 12,
  publishDate: "15 मई, 2025",
  author: {
    name: "डॉ. विजय शर्मा",
    avatar: "/placeholder.svg?height=40&width=40",
    organization: "कृषि विज्ञान केंद्र, जयपुर",
  },
  content: [
    {
      type: "paragraph",
      text: "गेहूं भारत की प्रमुख खाद्य फसलों में से एक है। उन्नत तकनीकों का उपयोग करके गेहूं की उपज को बढ़ाया जा सकता है। इस लेख में हम गेहूं की खेती के लिए आधुनिक तकनीकों और उन्नत बीजों के बारे में जानकारी देंगे।",
    },
    {
      type: "heading",
      text: "उन्नत बीज चयन",
    },
    {
      type: "paragraph",
      text: "गेहूं की खेती में सफलता का पहला कदम है उन्नत किस्म के बीजों का चयन। भारत में गेहूं की कई उन्नत किस्में विकसित की गई हैं जो विभिन्न जलवायु परिस्थितियों के लिए उपयुक्त हैं।",
    },
    {
      type: "list",
      items: [
        "HD-2967: यह किस्म उत्तर भारत के लिए उपयुक्त है और इसकी औसत उपज 50-55 क्विंटल प्रति हेक्टेयर है।",
        "PBW-550: यह किस्म पंजाब और हरियाणा के लिए उपयुक्त है और रोग प्रतिरोधी है।",
        "DBW-17: यह किस्म देर से बुवाई के लिए उपयुक्त है और गर्मी को सहन कर सकती है।",
      ],
    },
    {
      type: "image",
      url: "/placeholder.svg?height=300&width=600",
      caption: "गेहूं की विभिन्न उन्नत किस्में",
    },
    {
      type: "heading",
      text: "बुवाई का समय और विधि",
    },
    {
      type: "paragraph",
      text: "गेहूं की बुवाई का सही समय अक्टूबर के अंतिम सप्ताह से नवंबर के मध्य तक है। देर से बुवाई करने पर उपज में कमी आ सकती है।",
    },
    {
      type: "paragraph",
      text: "बुवाई की आधुनिक विधियों में सीड ड्रिल का उपयोग सबसे प्रभावी है। इससे बीज एक समान गहराई पर बोए जाते हैं और बीज की मात्रा भी नियंत्रित रहती है।",
    },
    {
      type: "heading",
      text: "उर्वरक प्रबंधन",
    },
    {
      type: "paragraph",
      text: "गेहूं की फसल के लिए संतुलित उर्वरक प्रबंधन आवश्यक है। मिट्टी परीक्षण के आधार पर उर्वरकों का प्रयोग करना चाहिए।",
    },
    {
      type: "list",
      items: ["नाइट्रोजन: 120-150 किग्रा प्रति हेक्टेयर", "फॉस्फोरस: 60-80 किग्रा प्रति हेक्टेयर", "पोटाश: 40-60 किग्रा प्रति हेक्टेयर"],
    },
    {
      type: "tip",
      text: "नाइट्रोजन की पूरी मात्रा एक साथ न देकर 2-3 बार में देना चाहिए। पहली खुराक बुवाई के समय, दूसरी पहली सिंचाई के समय और तीसरी दूसरी सिंचाई के समय दें।",
    },
    {
      type: "heading",
      text: "सिंचाई प्रबंधन",
    },
    {
      type: "paragraph",
      text: "गेहूं की फसल के लिए 4-6 सिंचाई की आवश्यकता होती है, जो मिट्टी के प्रकार और मौसम पर निर्भर करती है।",
    },
    {
      type: "list",
      items: [
        "पहली सिंचाई: बुवाई के 20-25 दिन बाद (क्राउन रूट स्टेज)",
        "दूसरी सिंचाई: पहली सिंचाई के 20-25 दिन बाद (टिलरिंग स्टेज)",
        "तीसरी सिंचाई: दूसरी सिंचाई के 20-25 दिन बाद (जॉइंटिंग स्टेज)",
        "चौथी सिंचाई: बालियां निकलने के समय",
        "पांचवीं सिंचाई: दाना भरने के समय",
      ],
    },
    {
      type: "image",
      url: "/placeholder.svg?height=300&width=600",
      caption: "ड्रिप सिंचाई प्रणाली से गेहूं की खेती",
    },
    {
      type: "heading",
      text: "रोग और कीट नियंत्रण",
    },
    {
      type: "paragraph",
      text: "गेहूं की फसल में मुख्य रूप से गेरुआ रोग, करनाल बंट और चूर्णिल आसिता जैसे रोग लगते हैं। इनके नियंत्रण के लिए रोग प्रतिरोधी किस्मों का चयन और समय पर उचित फंगीसाइड का छिड़काव करना चाहिए।",
    },
    {
      type: "tip",
      text: "गेरुआ रोग के नियंत्रण के लिए प्रोपिकोनाजोल 25% EC का 0.1% घोल (1 मिली दवा प्रति लीटर पानी) का छिड़काव करें।",
    },
    {
      type: "heading",
      text: "कटाई और भंडारण",
    },
    {
      type: "paragraph",
      text: "गेहूं की कटाई तब करनी चाहिए जब दाने पूरी तरह से पक जाएं और उनमें 12-14% नमी हो। कटाई के बाद गेहूं को अच्छी तरह से सुखाकर भंडारित करना चाहिए।",
    },
    {
      type: "paragraph",
      text: "भंडारण के लिए साफ, सूखे और कीट-मुक्त गोदाम का उपयोग करें। भंडारण से पहले गेहूं को धूप में अच्छी तरह सुखा लें।",
    },
    {
      type: "conclusion",
      text: "उन्नत तकनीकों और उचित प्रबंधन से गेहूं की उपज को बढ़ाया जा सकता है। सही बीज चयन, समय पर बुवाई, संतुलित उर्वरक प्रयोग, उचित सिंचाई और रोग नियंत्रण से गेहूं की खेती में सफलता मिल सकती है।",
    },
  ],
  relatedArticles: [
    {
      id: 2,
      title: "गेहूं की फसल में जल प्रबंधन",
      category: "जल प्रबंधन",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      title: "गेहूं के प्रमुख रोग और उनका नियंत्रण",
      category: "फसल सुरक्षा",
      image: "/placeholder.svg?height=100&width=150",
    },
  ],
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [isReading, setIsReading] = useState(false)
  const { toast } = useToast()

  // Handle save article
  const handleSaveArticle = () => {
    toast({
      title: "लेख सहेजा गया",
      description: "यह लेख ऑफलाइन पढ़ने के लिए सहेजा गया है।",
      duration: 3000,
    })
  }

  // Handle share article
  const handleShareArticle = () => {
    toast({
      title: "लेख शेयर किया गया",
      description: "लेख का लिंक कॉपी किया गया है।",
      duration: 3000,
    })
  }

  // Handle like article
  const handleLikeArticle = () => {
    toast({
      title: "पसंद किया गया",
      description: "आपने इस लेख को पसंद किया है।",
      duration: 3000,
    })
  }

  // Handle text-to-speech
  const handleTextToSpeech = () => {
    setIsReading(!isReading)
    toast({
      title: isReading ? "पठन रुका" : "पठन शुरू",
      description: isReading ? "लेख का पठन रोक दिया गया है।" : "लेख का पठन शुरू किया गया है।",
      duration: 3000,
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2">
        <Link href="/knowledge">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">लेख</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Article header */}
        <div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{mockArticle.category}</Badge>
          <h1 className="text-2xl font-bold mt-2">{mockArticle.title}</h1>
          <p className="text-gray-600 mt-1">{mockArticle.description}</p>

          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockArticle.author.avatar || "/placeholder.svg"} alt={mockArticle.author.name} />
              <AvatarFallback>{mockArticle.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{mockArticle.author.name}</p>
              <p className="text-xs text-gray-500">{mockArticle.author.organization}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>{mockArticle.publishDate}</span>
            <span>•</span>
            <span>{mockArticle.readTime} पढ़ने में</span>
            <span>•</span>
            <span>{mockArticle.views} बार देखा गया</span>
          </div>
        </div>

        {/* Article actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleSaveArticle}>
            <Download className="h-4 w-4 mr-1" />
            सहेजें
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleShareArticle}>
            <Share2 className="h-4 w-4 mr-1" />
            शेयर करें
          </Button>
          <Button
            variant={isReading ? "default" : "outline"}
            size="sm"
            className={`flex-1 text-xs ${isReading ? "bg-green-600 hover:bg-green-700" : ""}`}
            onClick={handleTextToSpeech}
          >
            <VolumeIcon className="h-4 w-4 mr-1" />
            {isReading ? "पढ़ना रोकें" : "सुनें"}
          </Button>
        </div>

        {/* Article content */}
        <div className="mt-2 space-y-4">
          {mockArticle.content.map((block, index) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p key={index} className="text-gray-800 leading-relaxed">
                    {block.text}
                  </p>
                )
              case "heading":
                return (
                  <h2 key={index} className="text-xl font-bold mt-6 mb-2">
                    {block.text}
                  </h2>
                )
              case "list":
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1 text-gray-800">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )
              case "image":
                return (
                  <div key={index} className="my-6">
                    <div className="relative w-full h-48">
                      <Image
                        src={block.url || "/placeholder.svg"}
                        alt={block.caption || "Article image"}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    {block.caption && <p className="text-center text-sm text-gray-500 mt-2">{block.caption}</p>}
                  </div>
                )
              case "tip":
                return (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                    <p className="text-blue-800 font-medium text-sm">सुझाव:</p>
                    <p className="text-blue-700 text-sm mt-1">{block.text}</p>
                  </div>
                )
              case "conclusion":
                return (
                  <div key={index} className="bg-green-50 p-4 rounded-md border border-green-200">
                    <p className="text-green-800 font-medium">निष्कर्ष:</p>
                    <p className="text-green-700 mt-1">{block.text}</p>
                  </div>
                )
              default:
                return null
            }
          })}
        </div>

        {/* Article feedback */}
        <div className="flex justify-between items-center mt-6 border-t border-b py-4">
          <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1" onClick={handleLikeArticle}>
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{mockArticle.likes} पसंद</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-sm flex items-center gap-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{mockArticle.comments} टिप्पणियां</span>
          </Button>
        </div>

        {/* Related articles */}
        <div className="mt-6">
          <h3 className="font-medium mb-3">संबंधित लेख</h3>
          <div className="grid grid-cols-2 gap-3">
            {mockArticle.relatedArticles.map((article) => (
              <Link key={article.id} href={`/knowledge/${article.id}`}>
                <Card className="p-2 hover:border-green-300 transition-colors h-full">
                  <div className="relative w-full h-20 mb-2">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">{article.category}</Badge>
                  <h4 className="font-medium text-sm mt-1 line-clamp-2">{article.title}</h4>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* More articles button */}
        <div className="mt-4">
          <Link href="/knowledge">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <BookOpen className="h-4 w-4 mr-2" />
              अधिक लेख देखें
            </Button>
          </Link>
        </div>

        {/* Offline mode notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-auto">
          <p className="text-xs text-yellow-800 flex items-center gap-1">
            <Info className="h-4 w-4" />
            ऑफलाइन मोड: यह लेख आपके डिवाइस पर सहेजा गया है और बिना इंटरनेट के भी उपलब्ध है।
          </p>
        </div>
      </div>
    </main>
  )
}
