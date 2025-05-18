"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Bell,
  Star,
  StarOff,
  Info,
  MapPin,
  Share2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import PriceChart from "@/components/price-chart"
import { Badge } from "@/components/ui/badge"

// Mock market price data (in a real app, this would come from an API)
const mockCrops = [
  {
    id: 1,
    name: "गेहूं (Wheat)",
    currentPrice: 2240,
    unit: "क्विंटल",
    change: 40,
    trend: "up",
    lastWeek: [2200, 2210, 2220, 2230, 2240, 2235, 2240],
    lastMonth: [2150, 2170, 2190, 2200, 2210, 2220, 2230, 2240, 2235, 2240, 2245, 2240],
    lastYear: [1950, 2000, 2050, 2100, 2150, 2200, 2240],
    isFavorite: true,
    grade: "A",
    moisture: "12-14%",
    bestMarket: "जयपुर कृषि मंडी",
    bestPrice: 2260,
    worstMarket: "अलवर कृषि मंडी",
    worstPrice: 2230,
    seasonalTrend: "मई-जून में मूल्य में वृद्धि की संभावना",
    harvestSeason: "मार्च-अप्रैल",
  },
  {
    id: 2,
    name: "चावल (Rice)",
    currentPrice: 3850,
    unit: "क्विंटल",
    change: -50,
    trend: "down",
    lastWeek: [3900, 3880, 3870, 3860, 3850, 3855, 3850],
    lastMonth: [3950, 3930, 3920, 3900, 3880, 3870, 3860, 3850, 3855, 3850, 3845, 3850],
    lastYear: [3700, 3750, 3800, 3850, 3900, 3950, 3850],
    isFavorite: true,
    grade: "A",
    moisture: "14-16%",
    bestMarket: "अजमेर कृषि मंडी",
    bestPrice: 3870,
    worstMarket: "जयपुर कृषि मंडी",
    worstPrice: 3830,
    seasonalTrend: "जुलाई-अगस्त में मूल्य में गिरावट की संभावना",
    harvestSeason: "अक्टूबर-नवंबर",
  },
]

export default function CropDetailPage({ params }: { params: { id: string } }) {
  const [crop, setCrop] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const { toast } = useToast()

  // Find the crop based on the ID
  useEffect(() => {
    const foundCrop = mockCrops.find((c) => c.id === Number.parseInt(params.id))
    if (foundCrop) {
      setCrop(foundCrop)
    }
  }, [params.id])

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!crop) return

    setCrop({ ...crop, isFavorite: !crop.isFavorite })

    toast({
      title: crop.isFavorite ? "फसल हटाई गई" : "फसल जोड़ी गई",
      description: crop.isFavorite
        ? `${crop.name} को पसंदीदा से हटा दिया गया है।`
        : `${crop.name} को पसंदीदा में जोड़ दिया गया है।`,
      duration: 3000,
    })
  }

  // Set price alert
  const setPriceAlert = () => {
    if (!crop) return

    toast({
      title: "मूल्य अलर्ट सेट किया गया",
      description: `${crop.name} के लिए मूल्य अलर्ट सेट किया गया है। जब मूल्य ${crop.currentPrice + 100} रुपये प्रति ${crop.unit} से अधिक होगा, आपको सूचित किया जाएगा।`,
      duration: 3000,
    })
  }

  // Share price information
  const sharePriceInfo = () => {
    if (!crop) return

    // In a real app, this would use the Web Share API
    toast({
      title: "शेयर किया गया",
      description: `${crop.name} के मूल्य की जानकारी शेयर की गई।`,
      duration: 3000,
    })
  }

  // Get chart data based on selected time range
  const getChartData = () => {
    if (!crop) return []

    switch (timeRange) {
      case "week":
        return crop.lastWeek
      case "month":
        return crop.lastMonth
      case "year":
        return crop.lastYear
      default:
        return crop.lastWeek
    }
  }

  if (!crop) {
    return (
      <main className="flex min-h-screen flex-col bg-green-50">
        <header className="bg-green-700 text-white p-4 flex items-center gap-2">
          <Link href="/market-prices">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">फसल विवरण</h1>
        </header>

        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <BarChart3 className="h-16 w-16 text-gray-300" />
          <p className="mt-4 text-gray-500">फसल नहीं मिली</p>
          <Link href="/market-prices">
            <Button className="mt-4 bg-green-600 hover:bg-green-700">वापस जाएं</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2">
        <Link href="/market-prices">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">फसल विवरण</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Crop header */}
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{crop.name}</h2>
                {crop.trend === "up" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +₹{Math.abs(crop.change)}
                  </Badge>
                ) : crop.trend === "down" ? (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -₹{Math.abs(crop.change)}
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">₹0</Badge>
                )}
              </div>
              <p className="text-3xl font-bold mt-2">
                ₹{crop.currentPrice}
                <span className="text-sm font-normal text-gray-500 ml-1">/ {crop.unit}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={toggleFavorite}>
                {crop.isFavorite ? (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="h-5 w-5 text-gray-400" />
                )}
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={setPriceAlert}>
                <Bell className="h-5 w-5 text-gray-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={sharePriceInfo}>
                <Share2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Price chart */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">मूल्य प्रवृत्ति</h3>
            <div className="flex gap-1">
              <Button
                variant={timeRange === "week" ? "default" : "outline"}
                size="sm"
                className={`text-xs px-2 py-1 h-7 ${timeRange === "week" ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => setTimeRange("week")}
              >
                साप्ताहिक
              </Button>
              <Button
                variant={timeRange === "month" ? "default" : "outline"}
                size="sm"
                className={`text-xs px-2 py-1 h-7 ${timeRange === "month" ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => setTimeRange("month")}
              >
                मासिक
              </Button>
              <Button
                variant={timeRange === "year" ? "default" : "outline"}
                size="sm"
                className={`text-xs px-2 py-1 h-7 ${timeRange === "year" ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => setTimeRange("year")}
              >
                वार्षिक
              </Button>
            </div>
          </div>

          <PriceChart data={getChartData()} trend={crop.trend} />

          <p className="text-xs text-gray-500 mt-2 text-center">
            {timeRange === "week"
              ? "पिछले 7 दिनों का मूल्य"
              : timeRange === "month"
                ? "पिछले 30 दिनों का मूल्य"
                : "पिछले 12 महीनों का मूल्य"}
            (₹ / {crop.unit})
          </p>
        </Card>

        {/* Detailed information */}
        <Tabs defaultValue="markets" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="markets" className="text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              मंडियां
            </TabsTrigger>
            <TabsTrigger value="details" className="text-sm">
              <Info className="h-3 w-3 mr-1" />
              विवरण
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              मौसमी
            </TabsTrigger>
          </TabsList>

          {/* Markets tab */}
          <TabsContent value="markets">
            <Card className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">सर्वोत्तम मूल्य</h4>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{crop.bestMarket}</span>
                  </div>
                  <span className="font-bold text-green-600">₹{crop.bestPrice}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">न्यूनतम मूल्य</h4>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span>{crop.worstMarket}</span>
                  </div>
                  <span className="font-bold text-red-600">₹{crop.worstPrice}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  आपके आस-पास की मंडियों में {crop.name} का औसत मूल्य ₹{crop.currentPrice} प्रति {crop.unit} है।
                </p>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">सभी मंडियां देखें</Button>
            </Card>
          </TabsContent>

          {/* Details tab */}
          <TabsContent value="details">
            <Card className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-xs text-gray-500">ग्रेड</h4>
                    <p className="font-medium">{crop.grade}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-xs text-gray-500">नमी</h4>
                    <p className="font-medium">{crop.moisture}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-xs text-gray-500">गुणवत्ता मानदंड</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• दाना आकार: बड़ा और समान</li>
                    <li>• रंग: चमकदार</li>
                    <li>• विदेशी पदार्थ: &lt;2%</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-xs text-gray-500">मूल्य निर्धारण कारक</h4>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• अंतरराष्ट्रीय बाजार मूल्य</li>
                    <li>• सरकारी नीतियां</li>
                    <li>• मौसमी मांग</li>
                    <li>• भंडारण क्षमता</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Seasonal tab */}
          <TabsContent value="seasonal">
            <Card className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">फसल मौसम</h4>
                <p className="mt-1">{crop.harvestSeason}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">मौसमी प्रवृत्ति</h4>
                <p className="mt-1">{crop.seasonalTrend}</p>
              </div>

              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                <h4 className="text-sm font-medium text-green-800">विशेषज्ञ सलाह</h4>
                <p className="text-sm mt-1 text-green-700">
                  {crop.trend === "up"
                    ? "वर्तमान में मूल्य बढ़ रहा है। यदि आपके पास भंडारण सुविधा है, तो कुछ समय के लिए फसल रखने पर विचार करें।"
                    : "वर्तमान में मूल्य घट रहा है। यदि आपको तत्काल बिक्री की आवश्यकता नहीं है, तो मूल्य स्थिर होने तक प्रतीक्षा करें।"}
                </p>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">अधिक विस्तृत मूल्य पूर्वानुमान और विश्लेषण के लिए, कृषि विशेषज्ञ से संपर्क करें।</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Offline mode notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-auto">
          <p className="text-xs text-yellow-800 flex items-center gap-1">
            <Info className="h-4 w-4" />
            ऑफलाइन मोड: आप पिछले अपडेट किए गए बाज़ार भाव देख रहे हैं। ताज़ा जानकारी के लिए इंटरनेट से कनेक्ट करें।
          </p>
        </div>
      </div>
    </main>
  )
}
