"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Send, Info, Flag } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock discussion data
const mockDiscussion = {
  id: 1,
  author: {
    name: "रमेश सिंह",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "जयपुर, राजस्थान",
    isVerified: true,
  },
  title: "क्या कोई बता सकता है कि गेहूं की फसल में पीला रोग कैसे रोकें?",
  content:
    "मेरे खेत में गेहूं की फसल में पीले रंग के धब्बे दिख रहे हैं। मैंने कुछ दवा का छिड़काव किया है, लेकिन समस्या बढ़ती जा रही है। क्या कोई इस समस्या का समाधान बता सकता है? मैंने HD-2967 किस्म का उपयोग किया है और बुवाई अक्टूबर के अंतिम सप्ताह में की थी। सिंचाई नियमित रूप से कर रहा हूं और उर्वरक भी डाला है।",
  tags: ["गेहूं", "रोग नियंत्रण", "खेती"],
  likes: 24,
  timeAgo: "2 घंटे पहले",
  images: ["/placeholder.svg?height=300&width=500"],
  comments: [
    {
      id: 1,
      author: {
        name: "अनिल कुमार",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "अलवर, राजस्थान",
        isVerified: true,
        isExpert: true,
      },
      content:
        "आपके द्वारा बताए गए लक्षण पीला रतुआ (Yellow Rust) रोग के हैं। यह एक कवक जनित रोग है जो ठंडे और नम मौसम में तेजी से फैलता है। इसके नियंत्रण के लिए निम्न उपाय करें:",
      timeAgo: "1 घंटे पहले",
      likes: 12,
      solution: [
        "प्रोपिकोनाजोल 25% EC का 0.1% घोल (1 मिली दवा प्रति लीटर पानी) का छिड़काव करें।",
        "छिड़काव सुबह या शाम के समय करें जब हवा की गति कम हो।",
        "यदि आवश्यक हो तो 15 दिन बाद दोबारा छिड़काव करें।",
        "अगली फसल के लिए रोग प्रतिरोधी किस्मों जैसे PBW-343, WH-542 का चयन करें।",
      ],
    },
    {
      id: 2,
      author: {
        name: "सुनीता देवी",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "उदयपुर, राजस्थान",
        isVerified: false,
        isExpert: false,
      },
      content:
        "मेरे खेत में भी यही समस्या थी। मैंने हेक्साकोनाजोल 5% EC का छिड़काव किया था और समस्या काफी हद तक कम हो गई थी। साथ ही खेत में पानी का जमाव न होने दें।",
      timeAgo: "45 मिनट पहले",
      likes: 5,
    },
    {
      id: 3,
      author: {
        name: "प्रकाश यादव",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "जोधपुर, राजस्थान",
        isVerified: false,
        isExpert: false,
      },
      content:
        "इस रोग के लिए नीम आधारित जैविक कीटनाशक भी प्रभावी होता है। 5 मिली नीम तेल को 1 लीटर पानी में मिलाकर छिड़काव करें। यह पर्यावरण के लिए भी अच्छा है और लागत भी कम आती है।",
      timeAgo: "30 मिनट पहले",
      likes: 3,
    },
  ],
}

export default function DiscussionPage({ params }: { params: { id: string } }) {
  const [commentText, setCommentText] = useState("")
  const { toast } = useToast()

  // Handle like discussion
  const handleLikeDiscussion = () => {
    toast({
      title: "पसंद किया गया",
      description: "आपने इस चर्चा को पसंद किया है।",
      duration: 3000,
    })
  }

  // Handle like comment
  const handleLikeComment = (commentId: number) => {
    toast({
      title: "पसंद किया गया",
      description: "आपने इस टिप्पणी को पसंद किया है।",
      duration: 3000,
    })
  }

  // Handle share discussion
  const handleShareDiscussion = () => {
    toast({
      title: "शेयर किया गया",
      description: "चर्चा का लिंक कॉपी किया गया है।",
      duration: 3000,
    })
  }

  // Handle submit comment
  const handleSubmitComment = () => {
    if (!commentText.trim()) return

    toast({
      title: "टिप्पणी जोड़ी गई",
      description: "आपकी टिप्पणी सफलतापूर्वक जोड़ी गई है।",
      duration: 3000,
    })

    setCommentText("")
  }

  // Handle report
  const handleReport = () => {
    toast({
      title: "रिपोर्ट किया गया",
      description: "इस पोस्ट को रिपोर्ट किया गया है। हमारी टीम इसकी समीक्षा करेगी।",
      duration: 3000,
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">चर्चा</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Discussion header */}
        <Card className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockDiscussion.author.avatar || "/placeholder.svg"} alt={mockDiscussion.author.name} />
              <AvatarFallback>{mockDiscussion.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{mockDiscussion.author.name}</span>
                {mockDiscussion.author.isVerified && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs px-1 py-0">प्रमाणित</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {mockDiscussion.author.location} • {mockDiscussion.timeAgo}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReport}>
              <Flag className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          <h2 className="font-bold text-lg mt-3">{mockDiscussion.title}</h2>
          <p className="text-gray-700 mt-2">{mockDiscussion.content}</p>

          {mockDiscussion.images.length > 0 && (
            <div className="mt-3">
              <Image
                src={mockDiscussion.images[0] || "/placeholder.svg"}
                alt="Discussion image"
                width={500}
                height={300}
                className="rounded-md w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {mockDiscussion.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-4 mt-4 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm flex items-center gap-1"
              onClick={handleLikeDiscussion}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{mockDiscussion.likes} पसंद</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm flex items-center gap-1"
              onClick={handleShareDiscussion}
            >
              <Share2 className="h-4 w-4" />
              <span>शेयर</span>
            </Button>
          </div>
        </Card>

        {/* Comments section */}
        <div>
          <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            टिप्पणियां ({mockDiscussion.comments.length})
          </h3>

          <div className="space-y-3">
            {mockDiscussion.comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author.name}</span>
                      {comment.author.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs px-1 py-0">प्रमाणित</Badge>
                      )}
                      {comment.author.isExpert && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs px-1 py-0">
                          विशेषज्ञ
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {comment.author.location} • {comment.timeAgo}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mt-2">{comment.content}</p>

                {comment.solution && (
                  <div className="mt-3 bg-green-50 p-3 rounded-md border border-green-200">
                    <p className="text-green-800 font-medium">समाधान:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-green-700 text-sm">
                      {comment.solution.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center gap-1"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>{comment.likes} पसंद</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Add comment */}
          <Card className="p-4 mt-4">
            <h4 className="font-medium mb-2">अपनी टिप्पणी जोड़ें</h4>
            <Textarea
              placeholder="अपनी टिप्पणी यहां लिखें..."
              className="min-h-24"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                भेजें
              </Button>
            </div>
          </Card>
        </div>

        {/* Offline mode notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-auto">
          <p className="text-xs text-yellow-800 flex items-center gap-1">
            <Info className="h-4 w-4" />
            ऑफलाइन मोड: आप इस चर्चा को देख सकते हैं, लेकिन नई टिप्पणियां जोड़ने के लिए इंटरनेट कनेक्शन की आवश्यकता होगी।
          </p>
        </div>
      </div>
    </main>
  )
}
