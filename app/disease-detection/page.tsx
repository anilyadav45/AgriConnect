"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Camera,
  ImageIcon,
  Loader2,
  Info,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Droplets,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ProductCard from "@/components/product-card"
import { detectDisease } from "@/lib/disease-detection"

// Types for disease detection results
interface DetectionResult {
  disease: string
  scientificName: string
  confidence: number
  description: string
  symptoms: string[]
  treatments: string[]
  preventions: string[]
  severity: "low" | "medium" | "high"
  affectedCrops: string[]
  imageUrl?: string
}

// Types for product recommendations
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

export default function DiseaseDetection() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<string>("diagnosis")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Add a demo mode option for environments where camera access isn't available
  const [demoMode, setDemoMode] = useState(false)

  // Handle camera activation
  const activateCamera = async () => {
    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser or context")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)

      // Show more specific error message based on error type
      let errorMessage = "कैमरा एक्सेस करने में समस्या हुई। कृपया अनुमति दें और पुनः प्रयास करें।"

      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage = "कैमरा का उपयोग करने की अनुमति नहीं मिली। कृपया अपने ब्राउज़र में अनुमति दें।"
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          errorMessage = "कोई कैमरा नहीं मिला। कृपया सुनिश्चित करें कि आपका डिवाइस कैमरा से लैस है।"
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorMessage = "कैमरा पहुंच योग्य नहीं है या किसी अन्य एप्लिकेशन द्वारा उपयोग में है।"
        } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
          errorMessage = "कैमरा आपके द्वारा अनुरोधित विशेषताओं का समर्थन नहीं करता है।"
        } else if (err.message.includes("API not supported")) {
          errorMessage = "आपका ब्राउज़र कैमरा API का समर्थन नहीं करता है। कृपया गैलरी से छवि अपलोड करें।"
        }
      }

      toast({
        title: "कैमरा एक्सेस त्रुटि",
        description: errorMessage,
        variant: "destructive",
      })

      // Suggest using file upload instead
      if (fileInputRef.current) {
        toast({
          title: "सुझाव",
          description: "कृपया गैलरी से छवि अपलोड करने का प्रयास करें।",
        })
      }
    }
  }

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setCapturedImage(imageData)

        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        setCameraActive(false)
      }
    }
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Analyze the image
  const analyzeImage = async () => {
    if (!capturedImage) return

    setIsAnalyzing(true)
    setActiveTab("diagnosis")

    try {
      // In a real app, this would call an AI model API
      // Here we're using a simulated detection function
      const detectionResult = await detectDisease(capturedImage)

      setResult(detectionResult)

      // Get product recommendations based on the detected disease
      const products = await getProductRecommendations(detectionResult)
      setRecommendedProducts(products)

      toast({
        title: "विश्लेषण पूर्ण",
        description: `${detectionResult.disease} का पता चला है। उपचार सुझाव देखें।`,
      })
    } catch (error) {
      console.error("Error analyzing image:", error)
      toast({
        title: "विश्लेषण त्रुटि",
        description: "छवि का विश्लेषण करने में समस्या हुई। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get product recommendations based on detected disease
  const getProductRecommendations = async (detectionResult: DetectionResult): Promise<Product[]> => {
    // In a real app, this would call a product recommendation API or database
    // Here we're returning mock data based on the disease

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock products based on disease type
    const mockProducts: Product[] = [
      {
        id: "prod1",
        name: "बायोफंगिसाइड स्प्रे",
        type: "fungicide",
        description: "जैविक फंगसाइड जो पत्ती झुलसा रोग के खिलाफ प्रभावी है",
        price: 450,
        rating: 4.5,
        reviewCount: 128,
        imageUrl: "/placeholder.svg?height=100&width=100",
        isOrganic: true,
        isGovernmentApproved: true,
        applicationMethod: "पत्तियों पर स्प्रे करें",
        dosage: "2 मिली प्रति लीटर पानी",
        availability: "in_stock",
      },
      {
        id: "prod2",
        name: "कॉपर ऑक्सीक्लोराइड",
        type: "fungicide",
        description: "कवक रोगों के खिलाफ प्रभावी रासायनिक फंगसाइड",
        price: 380,
        rating: 4.2,
        reviewCount: 95,
        imageUrl: "/placeholder.svg?height=100&width=100",
        isOrganic: false,
        isGovernmentApproved: true,
        applicationMethod: "पत्तियों पर स्प्रे करें",
        dosage: "2.5 ग्राम प्रति लीटर पानी",
        availability: "in_stock",
      },
      {
        id: "prod3",
        name: "माइक्रोन्यूट्रिएंट मिक्स",
        type: "fertilizer",
        description: "पौधों की प्रतिरोधक क्षमता बढ़ाने के लिए सूक्ष्म पोषक तत्व",
        price: 520,
        rating: 4.7,
        reviewCount: 73,
        imageUrl: "/placeholder.svg?height=100&width=100",
        isOrganic: true,
        isGovernmentApproved: true,
        applicationMethod: "पत्तियों पर स्प्रे करें या मिट्टी में मिलाएं",
        dosage: "1 ग्राम प्रति लीटर पानी",
        availability: "low_stock",
      },
      {
        id: "prod4",
        name: "नीम तेल स्प्रे",
        type: "pesticide",
        description: "प्राकृतिक कीटनाशक जो कई कीटों और रोगों को नियंत्रित करता है",
        price: 280,
        rating: 4.3,
        reviewCount: 156,
        imageUrl: "/placeholder.svg?height=100&width=100",
        isOrganic: true,
        isGovernmentApproved: true,
        applicationMethod: "पत्तियों पर स्प्रे करें",
        dosage: "5 मिली प्रति लीटर पानी",
        availability: "in_stock",
      },
    ]

    return mockProducts
  }

  // Reset the process
  const resetProcess = () => {
    setCapturedImage(null)
    setResult(null)
    setRecommendedProducts([])
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }
  }, [])

  // Add this function to handle demo mode
  const activateDemoMode = () => {
    // Use a sample image for demo purposes
    setCapturedImage("/placeholder.svg?height=400&width=300")
    setDemoMode(true)
    toast({
      title: "डेमो मोड सक्रिय",
      description: "डेमो मोड में एक नमूना छवि का उपयोग किया जा रहा है।",
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
        <h1 className="text-xl font-bold">रोग पहचान (Disease Detection)</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {!capturedImage && !cameraActive && (
          <Card className="p-6 shadow-md flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-green-800">AI रोग पहचान</h2>
              <p className="text-gray-600 mt-2">
                अपनी फसल की छवि अपलोड करें या कैमरे से लें और हमारा AI सिस्टम रोग का पता लगाएगा
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                onClick={activateCamera}
                className="flex flex-col gap-2 h-auto py-6 bg-green-600 hover:bg-green-700"
              >
                <Camera className="h-8 w-8" />
                <span>कैमरा</span>
                <span className="text-xs opacity-80">अनुमति की आवश्यकता है</span>
              </Button>

              <Button
                className="flex flex-col gap-2 h-auto py-6 bg-blue-600 hover:bg-blue-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-8 w-8" />
                <span>गैलरी</span>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Button>
            </div>

            {/* Add this button below the camera and gallery buttons */}
            <div className="mt-4 w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={activateDemoMode}
              >
                <Info className="h-4 w-4" />
                <span>डेमो मोड का उपयोग करें</span>
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">यदि कैमरा उपलब्ध नहीं है तो डेमो मोड का उपयोग करें</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 w-full">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <Info className="h-4 w-4 flex-shrink-0" />
                <span>सर्वोत्तम परिणामों के लिए, प्रभावित पत्ती या फसल का स्पष्ट और करीबी फोटो लें</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <Leaf className="h-6 w-6 text-green-600 mb-2" />
                <p className="text-xs font-medium">95% सटीकता</p>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <Zap className="h-6 w-6 text-amber-500 mb-2" />
                <p className="text-xs font-medium">तुरंत परिणाम</p>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <Droplets className="h-6 w-6 text-blue-500 mb-2" />
                <p className="text-xs font-medium">उपचार सुझाव</p>
              </div>
            </div>
          </Card>
        )}

        {cameraActive && (
          <Card className="p-4 shadow-md flex flex-col items-center gap-4">
            <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (videoRef.current) {
                    const stream = videoRef.current.srcObject as MediaStream
                    if (stream) {
                      stream.getTracks().forEach((track) => track.stop())
                    }
                    setCameraActive(false)
                  }
                }}
              >
                रद्द करें
              </Button>

              <Button onClick={captureImage} className="bg-green-600 hover:bg-green-700">
                <Camera className="h-4 w-4 mr-2" />
                फोटो लें
              </Button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </Card>
        )}

        {capturedImage && !result && !isAnalyzing && (
          <Card className="p-4 shadow-md flex flex-col items-center gap-4">
            <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden">
              <Image
                src={capturedImage || "/placeholder.svg"}
                alt="Captured plant image"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={resetProcess}>
                रद्द करें
              </Button>

              <Button onClick={analyzeImage} className="bg-green-600 hover:bg-green-700">
                विश्लेषण करें
              </Button>
            </div>
          </Card>
        )}

        {capturedImage && isAnalyzing && (
          <Card className="p-6 shadow-md flex flex-col items-center gap-6">
            <div className="relative w-full max-w-xs aspect-square bg-black rounded-lg overflow-hidden">
              <Image
                src={capturedImage || "/placeholder.svg"}
                alt="Analyzing plant image"
                fill
                className="object-contain opacity-70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <h3 className="text-lg font-medium">विश्लेषण हो रहा है...</h3>
                <p className="text-sm opacity-80 mt-2">AI मॉडल आपकी फसल का विश्लेषण कर रहा है</p>
              </div>
            </div>

            <div className="w-full max-w-md">
              <Progress value={65} className="h-2" />
              <p className="text-center text-sm text-gray-500 mt-2">कृपया प्रतीक्षा करें, यह कुछ सेकंड लग सकते हैं</p>
            </div>
          </Card>
        )}

        {result && (
          <Card className="shadow-md overflow-hidden">
            <Tabs defaultValue="diagnosis" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diagnosis">निदान</TabsTrigger>
                <TabsTrigger value="treatment">उपचार</TabsTrigger>
                <TabsTrigger value="products">उत्पाद</TabsTrigger>
              </TabsList>

              {/* Diagnosis Tab */}
              <TabsContent value="diagnosis" className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="relative w-1/3 aspect-square bg-black rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={capturedImage! || "/placeholder.svg"}
                        alt="Captured plant image"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg">{result.disease}</h2>
                        <Badge
                          className={cn(
                            "ml-2",
                            result.severity === "low"
                              ? "bg-green-100 text-green-800"
                              : result.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800",
                          )}
                        >
                          {result.severity === "low" ? "कम" : result.severity === "medium" ? "मध्यम" : "उच्च"} गंभीरता
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-500 italic mt-1">{result.scientificName}</p>

                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">AI विश्वास स्कोर</span>
                          <span className="text-sm font-medium">{result.confidence}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full w-full">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              result.confidence > 90
                                ? "bg-green-600"
                                : result.confidence > 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500",
                            )}
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h3 className="font-medium text-green-800">रोग का विवरण:</h3>
                    <p className="text-sm mt-1">{result.description}</p>
                  </div>

                  <div className="mt-2">
                    <h3 className="font-medium text-green-800">लक्षण:</h3>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                      {result.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={resetProcess}>
                      नई छवि
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("treatment")}>
                      उपचार देखें
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Treatment Tab */}
              <TabsContent value="treatment" className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-medium text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      अनुशंसित उपचार
                    </h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
                      {result.treatments.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      रोकथाम के उपाय
                    </h3>
                    <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
                      {result.preventions.map((prevention, index) => (
                        <li key={index}>{prevention}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800">विशेषज्ञ सलाह:</h3>
                    <p className="text-sm mt-1 text-blue-700">
                      इस रोग के प्रभावी नियंत्रण के लिए, उपचार जल्द से जल्द शुरू करें। यदि रोग गंभीर है या फैल रहा है, तो कृषि विशेषज्ञ से
                      संपर्क करें।
                    </p>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Button variant="outline" onClick={() => setActiveTab("diagnosis")}>
                      वापस जाएं
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("products")}>
                      अनुशंसित उत्पाद
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-green-800">अनुशंसित उत्पाद</h3>
                    <Badge className="bg-green-100 text-green-800">{recommendedProducts.length} उत्पाद</Badge>
                  </div>

                  <div className="space-y-4">
                    {recommendedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Info className="h-4 w-4 text-gray-500" />
                      ये उत्पाद केवल सुझाव हैं। खरीदने से पहले स्थानीय कृषि विशेषज्ञ से परामर्श करें।
                    </p>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Button variant="outline" onClick={() => setActiveTab("treatment")}>
                      वापस जाएं
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={resetProcess}>
                      नई छवि
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}

        {!result && !isAnalyzing && (
          <Card className="p-4 shadow-md mt-auto">
            <h3 className="font-medium text-center">टिप्स</h3>
            <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
              <li>रोग के सटीक निदान के लिए प्रभावित पत्ती या फसल का स्पष्ट फोटो लें</li>
              <li>अच्छी रोशनी में फोटो लें</li>
              <li>प्रभावित हिस्से को फोटो के केंद्र में रखें</li>
              <li>कई कोणों से फोटो लें अधिक सटीक परिणामों के लिए</li>
            </ul>
          </Card>
        )}
      </div>
    </main>
  )
}
