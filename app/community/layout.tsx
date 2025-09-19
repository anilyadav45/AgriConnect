import { CommunityProvider } from "@/contexts/CommunityContext"

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommunityProvider>{children}</CommunityProvider>
}