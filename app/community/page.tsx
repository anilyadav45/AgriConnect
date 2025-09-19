"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCommunity } from "@/contexts/CommunityContext" // <-- IMPORT CONTEXT
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, MessageCircle, ThumbsUp, MessageSquare, BookOpen, Award, Plus, Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Data for other tabs can remain here for now
const mockKnowledgeArticles = [ { id: 1, title: "Advanced Wheat Farming Techniques", description: "Information on modern techniques and seeds for wheat crops.", category: "Crop Technology", readTime: "5 min", views: 1250, image: "/placeholder.svg?height=150&width=250", isSaved: true } ]
const mockSuccessStories = [ { id: 1, farmer: { name: "Mahesh Patel", avatar: "/placeholder.svg?height=60&width=60", location: "Gujarat" }, title: "Drip Irrigation Changed My Fortune", summary: "A farmer struggling with water scarcity doubled his income by adopting drip irrigation.", impact: "120% increase in income, 60% water savings", image: "/placeholder.svg?height=200&width=350", likes: 128 } ]

export default function CommunityPage() {
  const { discussions } = useCommunity() // <-- GET DISCUSSIONS FROM CONTEXT
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredDiscussions = discussions.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLike = () => toast({ title: "Liked", duration: 3000 })

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2 sticky top-0 z-10">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white h-8 w-8"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-lg font-bold">Community</h1>
      </header>
      <div className="p-2">
        <div className="flex gap-2 p-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="Search discussions..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          {/* --- THIS BUTTON NOW LINKS TO THE NEW POST PAGE --- */}
          <Link href="/community/new-post">
            <Button size="icon" className="bg-green-600 hover:bg-green-700"><Plus className="h-4 w-4" /></Button>
          </Link>
        </div>
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions"><MessageCircle className="h-4 w-4 mr-1" />Discussions</TabsTrigger>
            <TabsTrigger value="knowledge"><BookOpen className="h-4 w-4 mr-1" />Knowledge</TabsTrigger>
            <TabsTrigger value="success"><Award className="h-4 w-4 mr-1" />Success</TabsTrigger>
          </TabsList>
          <TabsContent value="discussions" className="space-y-3 pt-2">
            {filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarImage src={discussion.author.avatar} /><AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback></Avatar>
                  <div>
                    <span className="font-medium text-sm">{discussion.author.name}</span>
                    <p className="text-xs text-gray-500">{discussion.author.location} • {discussion.timeAgo}</p>
                  </div>
                </div>
                <Link href={`/community/discussions/${discussion.id}`} className="block my-2">
                  <h3 className="font-bold">{discussion.title}</h3>
                  {discussion.images[0] && <Image src={discussion.images[0]} alt={discussion.title} width={500} height={300} className="rounded-md mt-2 w-full h-auto object-cover" />}
                </Link>
                <div className="flex justify-between items-center text-gray-600 border-t pt-2 mt-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleLike}><ThumbsUp className="h-4 w-4" />{discussion.likes}</Button>
                  <Link href={`/community/discussions/${discussion.id}`}>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{discussion.comments} Comments</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </TabsContent>
          {/* Other Tabs Content Here */}
        </Tabs>
      </div>
    </main>
  )
}