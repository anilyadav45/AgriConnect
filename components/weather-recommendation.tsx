import { Card } from "@/components/ui/card"
import { Droplets, AlertTriangle, TreesIcon as Plant, Bug, Sprout } from "lucide-react"

interface RecommendationProps {
  recommendation: {
    text: string
    icon: string
    priority: string
  }
}

export default function WeatherRecommendation({ recommendation }: RecommendationProps) {
  // Function to get the appropriate icon
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "water":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "drainage":
        return <Droplets className="h-5 w-5 text-blue-700" />
      case "disease":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "monitor":
        return <Plant className="h-5 w-5 text-green-600" />
      case "pest":
        return <Bug className="h-5 w-5 text-red-500" />
      case "fertilizer":
        return <Sprout className="h-5 w-5 text-green-500" />
      default:
        return <Plant className="h-5 w-5 text-green-600" />
    }
  }

  // Function to get border color based on priority
  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500"
      case "medium":
        return "border-l-4 border-l-yellow-500"
      case "low":
        return "border-l-4 border-l-green-500"
      default:
        return "border-l-4 border-l-gray-300"
    }
  }

  return (
    <Card className={`p-3 flex items-start gap-3 ${getBorderColor(recommendation.priority)}`}>
      <div className="bg-gray-100 p-2 rounded-full">{getIcon(recommendation.icon)}</div>
      <div className="flex-1">
        <p className="text-sm">{recommendation.text}</p>
        <p className="text-xs text-gray-500 mt-1">
          {recommendation.priority === "high"
            ? "उच्च प्राथमिकता"
            : recommendation.priority === "medium"
              ? "मध्यम प्राथमिकता"
              : "सामान्य सलाह"}
        </p>
      </div>
    </Card>
  )
}
