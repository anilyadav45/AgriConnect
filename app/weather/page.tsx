"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  Calendar,
  Info,
  RefreshCw,
  MapPin,
} from "lucide-react"
import WeatherCard from "@/components/weather-card"
import WeatherRecommendation from "@/components/weather-recommendation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Mock weather data (in a real app, this would come from an API)
const mockWeatherData = {
  current: {
    temp: 32,
    humidity: 65,
    windSpeed: 12,
    condition: "sunny",
    rainfall: 0,
  },
  forecast: [
    { day: "आज", date: "18 मई", temp: 32, condition: "sunny", rainfall: 0, humidity: 65 },
    { day: "कल", date: "19 मई", temp: 30, condition: "partly-cloudy", rainfall: 0, humidity: 70 },
    { day: "बुधवार", date: "20 मई", temp: 29, condition: "cloudy", rainfall: 20, humidity: 75 },
    { day: "गुरुवार", date: "21 मई", temp: 27, condition: "rainy", rainfall: 40, humidity: 85 },
    { day: "शुक्रवार", date: "22 मई", temp: 28, condition: "partly-cloudy", rainfall: 10, humidity: 80 },
  ],
  lastUpdated: "18 मई, 09:15 AM",
  location: "जयपुर, राजस्थान",
  crops: ["गेहूं", "चावल", "मक्का"],
}

// Farming recommendations based on weather and crop
const getRecommendations = (weather: any, crop: string) => {
  const recommendations = {
    गेहूं: [
      {
        condition: "sunny",
        text: "तेज धूप में सिंचाई सुबह या शाम को करें। फसल में पानी की मात्रा बनाए रखें।",
        icon: "water",
        priority: "high",
      },
      {
        condition: "rainy",
        text: "बारिश के दौरान खेत में पानी जमा न होने दें। जल निकासी सुनिश्चित करें।",
        icon: "drainage",
        priority: "high",
      },
      {
        condition: "any",
        text: "फसल की नियमित निगरानी करें और कीट या रोग के लक्षण दिखने पर तुरंत उपचार करें।",
        icon: "monitor",
        priority: "medium",
      },
    ],
    चावल: [
      {
        condition: "sunny",
        text: "खेत में पानी का स्तर 5 सेमी बनाए रखें। अधिक तापमान में पानी की मात्रा बढ़ाएं।",
        icon: "water",
        priority: "high",
      },
      {
        condition: "rainy",
        text: "अतिरिक्त बारिश के दौरान खेत से अतिरिक्त पानी निकालें।",
        icon: "drainage",
        priority: "high",
      },
      {
        condition: "any",
        text: "नाइट्रोजन उर्वरक का प्रयोग करें और खरपतवार नियंत्रण सुनिश्चित करें।",
        icon: "fertilizer",
        priority: "medium",
      },
    ],
    मक्का: [
      {
        condition: "sunny",
        text: "गर्म मौसम में नियमित सिंचाई करें, विशेषकर फूल और दाना बनने के समय।",
        icon: "water",
        priority: "high",
      },
      {
        condition: "rainy",
        text: "अत्यधिक नमी से फंगल रोग हो सकते हैं। फंगसाइड का छिड़काव करें।",
        icon: "disease",
        priority: "high",
      },
      {
        condition: "any",
        text: "फॉल आर्मीवॉर्म के लिए फसल की नियमित जांच करें और नियंत्रण उपाय अपनाएं।",
        icon: "pest",
        priority: "medium",
      },
    ],
  }

  // Get current weather condition
  const currentCondition = weather.current.condition
  const selectedCrop = crop as keyof typeof recommendations

  // Filter recommendations for the selected crop and current weather condition
  return recommendations[selectedCrop].filter((rec) => rec.condition === currentCondition || rec.condition === "any")
}

export default function WeatherPage() {
  const [selectedCrop, setSelectedCrop] = useState(mockWeatherData.crops[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Simulate refreshing weather data
  const refreshWeather = () => {
    setIsRefreshing(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "मौसम अपडेट",
        description: "मौसम की जानकारी अपडेट की गई है।",
        duration: 3000,
      })
    }, 2000)
  }

  // Get recommendations for the selected crop
  const recommendations = getRecommendations(mockWeatherData, selectedCrop)

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">मौसम (Weather)</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Location and refresh section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-green-700" />
            <span>{mockWeatherData.location}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={refreshWeather}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "अपडेट हो रहा है..." : "अपडेट करें"}
          </Button>
        </div>

        {/* Current weather card */}
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{mockWeatherData.current.temp}°C</h2>
              <p className="text-sm opacity-90">आज, {mockWeatherData.forecast[0].date}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Droplets className="h-4 w-4" />
                  <span className="text-sm">{mockWeatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-4 w-4" />
                  <span className="text-sm">{mockWeatherData.current.windSpeed} km/h</span>
                </div>
                <div className="flex items-center gap-1">
                  <CloudRain className="h-4 w-4" />
                  <span className="text-sm">{mockWeatherData.current.rainfall} mm</span>
                </div>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              {mockWeatherData.current.condition === "sunny" ? (
                <Sun className="h-10 w-10" />
              ) : mockWeatherData.current.condition === "rainy" ? (
                <CloudRain className="h-10 w-10" />
              ) : (
                <Cloud className="h-10 w-10" />
              )}
            </div>
          </div>
          <p className="text-xs mt-4 opacity-70">अंतिम अपडेट: {mockWeatherData.lastUpdated}</p>
        </Card>

        {/* 5-day forecast */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {mockWeatherData.forecast.map((day, index) => (
              <WeatherCard key={index} day={day} />
            ))}
          </div>
        </div>

        {/* Crop selector */}
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <ThermometerSun className="h-4 w-4 text-green-700" />
            फसल के अनुसार सलाह (Crop Recommendations)
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mockWeatherData.crops.map((crop) => (
              <Button
                key={crop}
                variant={selectedCrop === crop ? "default" : "outline"}
                className={`rounded-full text-xs px-3 py-1 h-auto ${
                  selectedCrop === crop ? "bg-green-600 hover:bg-green-700" : ""
                }`}
                onClick={() => setSelectedCrop(crop)}
              >
                {crop}
              </Button>
            ))}
          </div>
        </div>

        {/* Weather tabs - Daily and Weekly */}
        <Tabs defaultValue="recommendations" className="mt-2">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="recommendations" className="text-sm">
              <Info className="h-4 w-4 mr-1" />
              सलाह
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              कृषि कैलेंडर
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-3">
            {recommendations.map((rec, index) => (
              <WeatherRecommendation key={index} recommendation={rec} />
            ))}

            <Card className="p-3 border-dashed border-2 border-green-200 bg-green-50">
              <p className="text-sm text-center text-green-800">
                ये सलाह आपके क्षेत्र और फसल के अनुसार दी गई हैं। अधिक जानकारी के लिए कृषि विशेषज्ञ से संपर्क करें।
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="p-4">
              <h3 className="font-medium text-green-800 mb-2">{selectedCrop} - मई कृषि कैलेंडर</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>पहला पखवाड़ा: सिंचाई प्रबंधन, खरपतवार नियंत्रण</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>दूसरा पखवाड़ा: कीट नियंत्रण, पोषक तत्वों का छिड़काव</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>तीसरा पखवाड़ा: रोग नियंत्रण, फसल की निगरानी</span>
                </li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Offline mode notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-auto">
          <p className="text-xs text-yellow-800 flex items-center gap-1">
            <Info className="h-4 w-4" />
            ऑफलाइन मोड: आप पिछले अपडेट किए गए मौसम डेटा देख रहे हैं। ताज़ा जानकारी के लिए इंटरनेट से कनेक्ट करें।
          </p>
        </div>
      </div>
    </main>
  )
}

// This component is needed for the import in the file
function Cloud(props: any) {
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
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  )
}
