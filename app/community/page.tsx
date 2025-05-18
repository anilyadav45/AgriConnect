"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Users,
  MessageCircle,
  ThumbsUp,
  MessageSquare,
  BookOpen,
  Award,
  TrendingUp,
  Info,
  Plus,
  Filter,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock community data
const mockDiscussions = [
  {
    id: 1,
    author: {
      name: "रमेश सिंह",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "जयपुर, राजस्थान",
      isVerified: true,
    },
    title: "क्या कोई बता सकता है कि गेहूं की फसल में पीला रोग कैसे रोकें?",
    content:
      "मेरे खेत में गेहूं की फसल में पीले रंग के धब्बे दिख रहे हैं। मैंने कुछ दवा का छिड़काव किया है, लेकिन समस्या बढ़ती जा रही है। क्या कोई इस समस्या का समाधान बता सकता है?",
    tags: ["गेहूं", "रोग नियंत्रण", "खेती"],
    likes: 24,
    comments: 8,
    timeAgo: "2 घंटे पहले",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: 2,
    author: {
      name: "सुनीता देवी",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "उदयपुर, राजस्थान",
      isVerified: false,
    },
    title: "ड्रिप सिंचाई से मेरी सब्जियों की उपज दोगुनी हो गई!",
    content:
      "पिछले साल मैंने अपने खेत में ड्रिप सिंचाई प्रणाली लगाई। इससे न केवल पानी की बचत हुई, बल्कि मेरी टमाटर और मिर्च की उपज भी दोगुनी हो गई। मैं सभी किसान भाइयों को यह तकनीक अपनाने की सलाह देती हूं।",
    tags: ["सिंचाई", "सब्जियां", "सफलता"],
    likes: 56,
    comments: 12,
    timeAgo: "1 दिन पहले",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: 3,
    author: {
      name: "अनिल कुमार",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "अलवर, राजस्थान",
      isVerified: true,
    },
    title: "क्या कोई जैविक खेती के बारे में जानकारी दे सकता है?",
    content:
      "मैं अपने खेत में जैविक खेती शुरू करना चाहता हूं। क्या कोई बता सकता है कि शुरुआत कैसे करें और कौन से जैविक खाद और कीटनाशक अच्छे हैं?",
    tags: ["जैविक खेती", "खाद", "कीटनाशक"],
    likes: 18,
    comments: 6,
    timeAgo: "2 दिन पहले",
    images: [],
  },
]

const mockKnowledgeArticles = [
  {
    id: 1,
    title: "गेहूं की उन्नत खेती तकनीक",
    description: "गेहूं की फसल के लिए आधुनिक तकनीकों और बीजों की जानकारी",
    category: "फसल तकनीक",
    readTime: "5 मिनट",
    views: 1250,
    image: "/placeholder.svg?height=150&width=250",
    isSaved: true,
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
  },
]

const mockSuccessStories = [
  {
    id: 1,
    farmer: {
      name: "महेश पटेल",
      avatar: "/placeholder.svg?height=60&width=60",
      location: "गुजरात",
    },
    title: "ड्रिप सिंचाई से बदली मेरी किस्मत",
    summary: "पानी की कमी से जूझ रहे इस किसान ने ड्रिप सिंचाई अपनाकर अपनी आय दोगुनी कर ली",
    impact: "आय में 120% वृद्धि, पानी की 60% बचत",
    image: "/placeholder.svg?height=200&width=350",
    likes: 128,
  },
  {
    id: 2,
    farmer: {
      name: "लक्ष्मी देवी",
      avatar: "/placeholder.svg?height=60&width=60",
      location: "मध्य प्रदेश",
    },
    title: "जैविक खेती से मिला प्रीमियम मूल्य",
    summary: "महिला किसान ने जैविक खेती अपनाकर न केवल पर्यावरण बचाया बल्कि अपनी उपज का बेहतर मूल्य भी प्राप्त किया",
    impact: "30% अधिक मूल्य, शून्य रासायनिक लागत",
    image: "/placeholder.svg?height=200&width=350",
    likes: 95,
  },
]

const mockExperts = [
  {
    id: 1,
    name: "डॉ. विजय शर्मा",
    specialty: "फसल विशेषज्ञ",
    organization: "कृषि विज्ञान केंद्र, जयपुर",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.8,
    reviews: 56,
  },
  {
    id: 2,
    name: "डॉ. अनिता सिंह",
    specialty: "मृदा विज्ञान विशेषज्ञ",
    organization: "राजस्थान कृषि विश्वविद्यालय",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4.9,
    reviews: 42,
  },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Filter discussions based on search query
  const filteredDiscussions = mockDiscussions.filter(
    (discussion) =>
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Filter knowledge articles based on search query
  const filteredArticles = mockKnowledgeArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle like action
  const handleLike = (id: number, type: "discussion" | "story") => {
    toast({
      title: "पसंद किया गया",
      description: "आपने इस पोस्ट को पसंद किया है।",
      duration: 3000,
    })
  }

  // Handle save article
  const handleSaveArticle = (id: number) => {
    toast({
      title: "लेख सहेजा गया",
      description: "यह लेख ऑफलाइन पढ़ने के लिए सहेजा गया है।",
      duration: 3000,
    })
  }

  // Handle new post
  const handleNewPost = () => {
    toast({
      title: "नया पोस्ट",
      description: "आप नया पोस्ट या प्रश्न बना सकते हैं।",
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
        <h1 className="text-xl font-bold">समुदाय (Community)</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Search and filter section */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="खोजें..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="flex-shrink-0 bg-green-600 hover:bg-green-700"
            onClick={handleNewPost}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="discussions" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="discussions" className="text-sm">
              <MessageCircle className="h-3 w-3 mr-1" />
              चर्चा
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="text-sm">
              <BookOpen className="h-3 w-3 mr-1" />
              ज्ञान
            </TabsTrigger>
            <TabsTrigger value="success" className="text-sm">
              <Award className="h-3 w-3 mr-1" />
              सफलता
            </TabsTrigger>
          </TabsList>

          {/* Discussions tab */}
          <TabsContent value="discussions" className="space-y-4">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion) => (
                <Card key={discussion.id} className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} alt={discussion.author.name} />
                      <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{discussion.author.name}</span>
                        {discussion.author.isVerified && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs px-1 py-0">
                            प्रमाणित
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {discussion.author.location} • {discussion.timeAgo}
                      </p>
                    </div>
                  </div>

                  <Link href={`/community/discussions/${discussion.id}`}>
                    <h3 className="font-medium mt-3">{discussion.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{discussion.content}</p>
                  </Link>

                  {discussion.images.length > 0 && (
                    <div className="mt-3">
                      <Image
                        src={discussion.images[0] || "/placeholder.svg"}
                        alt="Discussion image"
                        width={300}
                        height={200}
                        className="rounded-md w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {discussion.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={() => handleLike(discussion.id, "discussion")}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{discussion.likes}</span>
                    </Button>
                    <Link href={`/community/discussions/${discussion.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.comments} टिप्पणियां</span>
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2 text-gray-500">कोई चर्चा नहीं मिली</p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={handleNewPost}>
                  नई चर्चा शुरू करें
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Knowledge tab */}
          <TabsContent value="knowledge" className="space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Link key={article.id} href={`/knowledge/${article.id}`}>
                  <Card className="p-4 hover:border-green-300 transition-colors">
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                          {article.category}
                        </Badge>
                        <h3 className="font-medium mt-1">{article.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{article.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{article.readTime} पढ़ने में</span>
                            <span>•</span>
                            <span>{article.views} बार देखा गया</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleSaveArticle(article.id)
                            }}
                          >
                            <BookOpen className={`h-4 w-4 ${article.isSaved ? "fill-green-500 text-green-500" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2 text-gray-500">कोई लेख नहीं मिला</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <BookOpen className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-sm">सहेजे गए लेख</h3>
                <p className="text-xs text-gray-600 mt-1">ऑफलाइन पढ़ने के लिए सहेजे गए लेख देखें</p>
                <Button variant="outline" size="sm" className="mt-2 text-xs w-full border-green-300 text-green-700">
                  देखें
                </Button>
              </Card>

              <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <TrendingUp className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-sm">लोकप्रिय विषय</h3>
                <p className="text-xs text-gray-600 mt-1">सबसे अधिक पढ़े जाने वाले विषय देखें</p>
                <Button variant="outline" size="sm" className="mt-2 text-xs w-full border-blue-300 text-blue-700">
                  देखें
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* Success Stories tab */}
          <TabsContent value="success" className="space-y-4">
            {mockSuccessStories.map((story) => (
              <Card key={story.id} className="p-4">
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    fill
                    className="rounded-md object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="font-medium text-white">{story.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={story.farmer.avatar || "/placeholder.svg"} alt={story.farmer.name} />
                    <AvatarFallback>{story.farmer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{story.farmer.name}</p>
                    <p className="text-xs text-gray-500">{story.farmer.location}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600">{story.summary}</p>

                <div className="mt-3 bg-green-50 p-2 rounded-md border border-green-100">
                  <p className="text-xs text-green-800 font-medium">प्रभाव:</p>
                  <p className="text-sm text-green-700">{story.impact}</p>
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center gap-1"
                    onClick={() => handleLike(story.id, "story")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{story.likes}</span>
                  </Button>
                  <Link href={`/community/success-stories/${story.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      पूरी कहानी पढ़ें
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}

            <Card className="p-4 border-dashed border-2 border-green-200">
              <div className="text-center py-4">
                <Award className="h-12 w-12 mx-auto text-green-300" />
                <h3 className="font-medium mt-2">अपनी सफलता की कहानी साझा करें</h3>
                <p className="text-sm text-gray-500 mt-1">अपने अनुभव साझा करके अन्य किसानों को प्रेरित करें</p>
                <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={handleNewPost}>
                  कहानी साझा करें
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Expert section */}
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Users className="h-4 w-4 text-green-700" />
            कृषि विशेषज्ञ
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {mockExperts.map((expert) => (
              <Card key={expert.id} className="p-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{expert.name}</p>
                    <p className="text-xs text-gray-500">{expert.specialty}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{expert.organization}</div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span>
                      {expert.rating} ({expert.reviews})
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                    संपर्क करें
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Offline mode notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-auto">
          <p className="text-xs text-yellow-800 flex items-center gap-1">
            <Info className="h-4 w-4" />
            ऑफलाइन मोड: आप सहेजे गए लेख और चर्चाएं देख सकते हैं। ताज़ा सामग्री के लिए इंटरनेट से कनेक्ट करें।
          </p>
        </div>
      </div>
    </main>
  )
}

// This component is needed for the import in the file
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
