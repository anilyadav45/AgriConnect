"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShoppingCart, Star, Check, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  type: "fertilizer" | "pesticide" | "fungicide" | "tool" | "other"
  description: string
  price: number
  rating: number
  reviewCount: number
  imageUrl: string
  isOrganic: boolean
  isGovernmentApproved: boolean
  applicationMethod: string
  dosage: string
  availability: "in_stock" | "low_stock" | "out_of_stock"
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()

  const handleAddToCart = () => {
    toast({
      title: "कार्ट में जोड़ा गया",
      description: `${product.name} आपके कार्ट में जोड़ दिया गया है।`,
    })
  }

  const handleViewDetails = () => {
    toast({
      title: "उत्पाद विवरण",
      description: "उत्पाद विवरण पेज अभी उपलब्ध नहीं है।",
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex p-3 gap-3">
        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
          <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{product.type}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs ml-1">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {product.isOrganic && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                जैविक
              </Badge>
            )}
            {product.isGovernmentApproved && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                सरकार द्वारा अनुमोदित
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-xs ${
                product.availability === "in_stock"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : product.availability === "low_stock"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {product.availability === "in_stock"
                ? "स्टॉक में"
                : product.availability === "low_stock"
                  ? "कम स्टॉक"
                  : "स्टॉक में नहीं"}
            </Badge>
          </div>

          <p className="text-xs mt-1 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="font-bold text-green-700">₹{product.price}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleViewDetails}>
                <Info className="h-3 w-3 mr-1" />
                विवरण
              </Button>
              <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700" onClick={handleAddToCart}>
                <ShoppingCart className="h-3 w-3 mr-1" />
                कार्ट में जोड़ें
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-2 border-t text-xs">
        <div className="flex items-start gap-1">
          <Check className="h-3 w-3 text-green-600 mt-0.5" />
          <div>
            <span className="font-medium">उपयोग विधि:</span> {product.applicationMethod}
          </div>
        </div>
        <div className="flex items-start gap-1 mt-1">
          <Check className="h-3 w-3 text-green-600 mt-0.5" />
          <div>
            <span className="font-medium">मात्रा:</span> {product.dosage}
          </div>
        </div>
      </div>
    </Card>
  )
}
