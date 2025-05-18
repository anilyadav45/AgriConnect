import { Card } from "@/components/ui/card"
import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MarketCardProps {
  market: {
    id: number
    name: string
    distance: number
    prices: {
      [key: string]: number
    }
  }
}

export default function MarketCard({ market }: MarketCardProps) {
  return (
    <Card className="p-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-700" />
            <h3 className="font-medium">{market.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              {market.distance} किमी दूर
            </span>
          </p>
        </div>
        <Link href={`https://maps.google.com/?q=${market.name}`} target="_blank">
          <Button variant="outline" size="sm" className="text-xs">
            रास्ता देखें
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {Object.entries(market.prices).map(([crop, price], index) => (
          <div key={index} className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">{crop}</p>
            <p className="font-bold">
              ₹{price} <span className="text-xs font-normal">/ क्विंटल</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
