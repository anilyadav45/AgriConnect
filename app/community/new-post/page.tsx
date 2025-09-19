"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCommunity, Discussion } from "@/contexts/CommunityContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ImagePlus, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { addDiscussion } = useCommunity()
  const router = useRouter()
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both the title and content.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const newDiscussion: Discussion = {
      id: Date.now(), // Use a timestamp for a unique ID
      author: { // Using placeholder author data
        name: "Anonymous Farmer",
        avatar: "https://imgs.search.brave.com/busrkZTfRJQ7vWXP74nfCS-PFk-0s8mDfDUfTC-P908/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2MzL2U4/L2NmL2MzZThjZmEy/MWM0YTBlNjhhODgy/MGUyMzUxZjMzMGQz/LmpwZw",
        location: "India",
        isVerified: false,
      },
      title,
      content,
      tags: ["New Post"],
      likes: 0,
      comments: 0,
      timeAgo: "Just now",
      images: imagePreview ? [imagePreview] : ["https://imgs.search.brave.com/SGgndg9-T6ArIjVmECNLF5Pej_A8wWQScaMJPcKrWDo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YWdyaXZpLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMS8w/NS9Dcm9wLURpc2Vh/c2VzLVRoZS1OaWdo/dG1hcmUtb2YtRXZl/cnktRmFybWVyLTEy/MDB4NTY1LmpwZWc"],
    }

    addDiscussion(newDiscussion)
    toast({
      title: "Success!",
      description: "Your discussion has been posted.",
      duration: 3000,
    })
    router.push("/community")
  }

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Post Your Problem here</h1>
      </header>
      <div className="flex-1 p-4">
        <Card className="p-4 space-y-4">
          <Input
            placeholder="Writ your problem title"
            className="font-medium text-lg border-0 px-1 focus-visible:ring-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="What issue are you facing? Provide as much detail as possible"
            className="min-h-40 border-0 px-1 focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image src={imagePreview} alt="Preview" width={200} height={200} className="rounded-md object-cover" />
            </div>
          )}
          <div className="flex justify-between items-center pt-4 border-t">
            <label htmlFor="image-upload" className="cursor-pointer text-green-700">
              <ImagePlus className="h-6 w-6" />
            </label>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}