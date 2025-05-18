import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import LanguageSelector from "@/components/language-selector"
import UserMenu from "@/components/user-menu"

export default function Header() {
  return (
    <header className="bg-green-700 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">AgriConnect</h1>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <UserMenu />
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  )
}
