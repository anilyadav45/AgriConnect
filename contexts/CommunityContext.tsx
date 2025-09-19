"use client"

import { createContext, useState, useContext, ReactNode } from "react"

// Defines the structure for a single discussion post
export interface Discussion {
  id: number
  author: {
    name: string
    avatar: string
    location: string
    isVerified: boolean
  }
  title: string
  content: string
  tags: string[]
  likes: number
  comments: number
  timeAgo: string
  images: string[]
}

// Defines what the context will provide: a list of discussions and a function to add one
interface CommunityContextType {
  discussions: Discussion[]
  addDiscussion: (newDiscussion: Discussion) => void
}

// Initial data for the community feed
const initialDiscussions: Discussion[] = [
  {
    id: 1,
    author: {
      name: "Vivek Raj",
      avatar: "https://imgs.search.brave.com/L91pEh7PFj4nnPeBinaSe4XBwNopQciNbnFVVVnfNKs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEwLzgzLzMzLzYw/LzM2MF9GXzEwODMz/MzYwNjNfbDRZcEla/R2JDa3I4THZtTGhX/bHBWcXJ4b0g0T09s/ZDQuanBn",
      location: "Punjab, India",
      isVerified: true,
    },
    title: "How to get rid of pests in my cornfield?",
    content: "I've sprayed some medicine, but the problem is getting worse...",
    tags: ["Wheat", "Disease Control", "Farming"],
    likes: 44,
    comments: 8,
    timeAgo: "2 hours ago",
    images: ["https://imgs.search.brave.com/SO0k3cFi3Z4TM4DStHlDCyqV3h047DU69ipteFNItdA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vZ2VvcGFy/ZC50ZWNoL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzEyL0Ny/b3AtRGlzZWFzZXNf/LVR5cGVzLUNhdXNl/cy1hbmQtU3ltcHRv/bXMtMi1taW4uanBn/P3Jlc2l6ZT04MTAs/NDM5JnNzbD0x"],
  },
   {
    id: 2,
    author: {
      name: "Anil Yadav",
      avatar: "https://imgs.search.brave.com/lmQgP3s5G6f3bEqM5JQaVqnPna33gFt776MlDoO5AXw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmcu/cG5ndHJlZS5jb20v/cG5nLWNsaXBhcnQv/MjAyMTEwMDkvb3Vy/bWlkL3BuZ3RyZWUt/aW5kaWFuLWZhcm1l/cnMtY2FydG9vbi1i/bHVlLXBuZy1pbWFn/ZV8zOTY2Mjc1LnBu/Zw",
      location: "Jaipur, Rajasthan",
      isVerified: true,
    },
    title: "How to prevent yellow rust in wheat?",
    content: "I'm seeing yellow spots on my wheat crop. I've sprayed some medicine, but the problem is getting worse...",
    tags: ["Wheat", "Disease Control", "Farming"],
    likes: 56,
    comments: 11,
    timeAgo: "5 min ago",
    images: ["https://imgs.search.brave.com/cWCMwqF4x2l5w_P7uJLtlyDycBUMIRJwHO1edTbbrXo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lb3Mu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIxLzEyL2RpcnR5/LXBhbmljbGUtZGlz/ZWFzZS5qcGcud2Vi/cA"],
  },
  
]

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

// This component provides the shared state to its children
export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions)

  const addDiscussion = (newDiscussion: Discussion) => {
    setDiscussions((prevDiscussions) => [newDiscussion, ...prevDiscussions])
  }

  return (
    <CommunityContext.Provider value={{ discussions, addDiscussion }}>
      {children}
    </CommunityContext.Provider>
  )
}

// This is a helper hook to easily access the context
export const useCommunity = () => {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider")
  }
  return context
}