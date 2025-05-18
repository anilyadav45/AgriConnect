"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  BarChart3,
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
  Bell,
  RefreshCw,
  Star,
  StarOff,
  ChevronRight,
  Info,
  Filter,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import PriceChart from "@/components/price-chart"
import MarketCard from "@/components/market-card"
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
    isFavorite: true,
  },
  {
    id: 2,
    name: "चावल (Rice)",
    currentPrice: 3850,
    unit: "क्विंटल",
    change: -50,
    trend: "down",
    lastWeek: [3900, 3880, 3870, 3860, 3850, 3855, 3850],
    isFavorite: true,
  },
  {
    id: 3,
    name: "मक्का (Corn)",
    currentPrice: 1950,
    unit: "क्विंटल",
    change: 25,
    trend: "up",
    lastWeek: [1925, 1930, 1940, 1945, 1950, 1948, 1950],
    isFavorite: false,
  },
  {
    id: 4,
    name: "सोयाबीन (Soybean)",
    currentPrice: 4200,
    unit: "क्विंटल",
    change: 0,
    trend: "stable",
    lastWeek: [4200, 4200, 4195, 4205, 4200, 4200, 4200],
    isFavorite: false,
  },
  {
    id: 5,
    name: "सरसों (Mustard)",
    currentPrice: 5100,
    unit: "क्विंटल",
    change: 150,
    trend: "up",
    lastWeek: [4950, 4980, 5000, 5050, 5080, 5100, 5100],
    isFavorite: false,
  },
  {
    id: 6,
    name: "कपास (Cotton)",
    currentPrice: 6250,
    unit: "क्विंटल",
    change: -100,
    trend: "down",
    lastWeek: [6350, 6320, 6300, 6280, 6270, 6260, 6250],
    isFavorite: false,
  },
]

// Mock nearby markets data
const mockMarkets = [
  {
    id: 1,
    name: "जयपुर कृषि मंडी",
    distance: 12,
    prices: {
      "गेहूं (Wheat)": 2240,
      "चावल (Rice)": 3850,
      "मक्का (Corn)": 1950,
    },
  },
  {
    id: 2,
    name: "अजमेर कृषि मंडी",
    distance: 28,
    prices: {
      "गेहूं (Wheat)": 2260,
      "चावल (Rice)": 3830,
      "मक्का (Corn)": 1970,
    },
  },
  {
    id: 3,
    name: "अलवर कृषि मंडी",
    distance: 35,
    prices: {
      "गेहूं (Wheat)": 2230,
      "चावल (Rice)": 3870,
      "मक्का (Corn)": 1940,
    },
  },
]

export default function MarketPricesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [crops, setCrops] = useState(mockCrops)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState(mockCrops[0])
  const { toast } = useToast()

  // Filter crops based on search query
  const filteredCrops = crops.filter((crop) => crop.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setCrops(crops.map((crop) => (crop.id === id ? { ...crop, isFavorite: !crop.isFavorite } : crop)))

    const crop = crops.find((c) => c.id === id)
    if (crop) {
      toast({
        title: crop.isFavorite ? "फसल हटाई गई" : "फसल जोड़ी गई",
        description: crop.isFavorite
          ? `${crop.name} को पसंदीदा से हटा दिया गया है।`
          : `${crop.name} को पसंदीदा में जोड़ दिया गया है।`,
        duration: 3000,
      })
    }
  }

  // Simulate refreshing price data
  const refreshPrices = () => {
    setIsRefreshing(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "मूल्य अपडेट",
        description: "बाज़ार मूल्य की जानकारी अपडेट की गई है।",
        duration: 3000,
      })
    }, 2000)
  }

  // Set price alert
  const setPriceAlert = (crop: any) => {
    toast({
      title: "मूल्य अलर्ट सेट किया गया",
      description: `${crop.name} के लिए मूल्य अलर्ट सेट किया गया है। जब मूल्य ${crop.currentPrice + 100} रुपये प्रति ${crop.unit} से अधिक होगा, आपको सूचित किया जाएगा।`,
      duration: 3000,
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">बाज़ार भाव (Market Prices)</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Search and filter section */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="फसल खोजें..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={refreshPrices}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Last updated info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-green-700" />
            <span>जयपुर, राजस्थान</span>
          </div>
          <p className="text-xs text-gray-500">अंतिम अपडेट: 18 मई, 09:15 AM</p>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="all" className="text-sm">
              सभी फसलें
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-sm">
              <Star className="h-3 w-3 mr-1 fill-current" />
              पसंदीदा
            </TabsTrigger>
            <TabsTrigger value="markets" className="text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              मंडियां
            </TabsTrigger>
          </TabsList>

          {/* All crops tab */}
          <TabsContent value="all" className="space-y-3">
            {filteredCrops.length > 0 ? (
              filteredCrops.map((crop) => (
                <Card key={crop.id} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{crop.name}</h3>
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
                      <p className="text-2xl font-bold mt-1">
                        ₹{crop.currentPrice}
                        <span className="text-sm font-normal text-gray-500 ml-1">/ {crop.unit}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(crop.id)}>
                        {crop.isFavorite ? (
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPriceAlert(crop)}>
                        <Bell className="h-5 w-5 text-gray-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3" onClick={() => setSelectedCrop(crop)}>
                    <Link href={`/market-prices/${crop.id}`}>
                      <Button variant="outline" className="w-full text-sm" size="sm">
                        विस्तृत जानकारी
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2 text-gray-500">कोई फसल नहीं मिली</p>
              </div>
            )}
          </TabsContent>

          {/* Favorites tab */}
          <TabsContent value="favorites" className="space-y-3">
            {filteredCrops.filter((crop) => crop.isFavorite).length > 0 ? (
              filteredCrops
                .filter((crop) => crop.isFavorite)
                .map((crop) => (
                  <Card key={crop.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{crop.name}</h3>
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
                        <p className="text-2xl font-bold mt-1">
                          ₹{crop.currentPrice}
                          <span className="text-sm font-normal text-gray-500 ml-1">/ {crop.unit}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(crop.id)}>
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPriceAlert(crop)}>
                          <Bell className="h-5 w-5 text-gray-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Link href={`/market-prices/${crop.id}`}>
                        <Button variant="outline" className="w-full text-sm" size="sm">
                          विस्तृत जानकारी
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2 text-gray-500">कोई पसंदीदा फसल नहीं है</p>
                <p className="text-sm text-gray-400">फसलों को पसंदीदा में जोड़ने के लिए स्टार आइकन पर क्लिक करें</p>
              </div>
            )}
          </TabsContent>

          {/* Markets tab */}
          <TabsContent value="markets" className="space-y-3">
            {mockMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Selected crop details */}
        {selectedCrop && (
          <Card className="p-4 mt-4">
            <h3 className="font-medium mb-2">मूल्य प्रवृत्ति: {selectedCrop.name}</h3>
            <PriceChart data={selectedCrop.lastWeek} trend={selectedCrop.trend} />
            <p className="text-xs text-gray-500 mt-2 text-center">पिछले 7 दिनों का मूल्य (₹ / {selectedCrop.unit})</p>
          </Card>
        )}

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
