import { CloudRain, Cloud, Sun, CloudSun } from "lucide-react"
import { Card } from "@/components/ui/card"

interface WeatherCardProps {
  day: {
    day: string
    date: string
    temp: number
    condition: string
    rainfall: number
    humidity: number
  }
}

export default function WeatherCard({ day }: WeatherCardProps) {
  // Function to get the appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "partly-cloudy":
        return <CloudSun className="h-8 w-8 text-gray-500" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  // Function to get background color based on condition
  const getBackgroundColor = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "bg-gradient-to-b from-yellow-50 to-orange-50"
      case "rainy":
        return "bg-gradient-to-b from-blue-50 to-indigo-50"
      case "cloudy":
        return "bg-gradient-to-b from-gray-50 to-slate-50"
      case "partly-cloudy":
        return "bg-gradient-to-b from-blue-50 to-gray-50"
      default:
        return "bg-white"
    }
  }

  return (
    <Card className={`p-3 min-w-[100px] ${getBackgroundColor(day.condition)}`}>
      <div className="flex flex-col items-center">
        <p className="font-medium text-sm">{day.day}</p>
        <p className="text-xs text-gray-500">{day.date}</p>

        <div className="my-2">{getWeatherIcon(day.condition)}</div>

        <p className="font-bold text-lg">{day.temp}°C</p>

        <div className="flex items-center gap-1 mt-1">
          <CloudRain className="h-3 w-3 text-blue-500" />
          <span className="text-xs">{day.rainfall} mm</span>
        </div>
      </div>
    </Card>
  )
}
