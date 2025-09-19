"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  X,
  Send,
  Mic,
  VolumeIcon,
  VolumeX,
  Wifi,
  WifiOff,
  Lightbulb,
  Leaf,
  CloudRain,
  BarChart3,
  FlaskConical,
  Sprout,
  ChevronDown,
  Warehouse,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Sample predefined responses for offline mode in English - EXPANDED
const offlineResponses = [
  {
    query: "yellow rust in wheat",
    response:
      "Yellow Rust is a fungal disease. To control it, spray Propiconazole 25% EC at a 0.1% solution (1 ml of medicine per liter of water).",
  },
  {
    query: "tomato cultivation",
    response:
      "The suitable soil for tomato cultivation is loamy or sandy loam. Plant seedlings at a distance of 60 x 45 cm. Use a balanced amount of Nitrogen, Phosphorus, and Potash.",
  },
  {
    query: "crop insurance",
    response:
      "You can get your crops insured under the Pradhan Mantri Fasal Bima Yojana (PMFBY). For this, contact your nearest bank or agriculture department office.",
  },
  {
    query: "irrigation",
    response:
      "Drip irrigation and sprinkler irrigation are effective methods for water conservation. They save 30-50% of water and also increase crop yield.",
  },
  {
    query: "organic farming",
    response:
      "In organic farming, natural methods are used instead of chemical fertilizers and pesticides. Organic manure, jeevamrut, and neem-based pesticides are effective alternatives.",
  },
  {
    query: "soil test",
    response: "Soil testing is crucial for understanding nutrient deficiencies. Collect soil samples from different parts of your field and get them tested at a local agricultural center.",
  },
   {
    query: "fertilizer",
    response: "NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K). The right ratio depends on your crop and soil health.",
  },
  {
    query: "rice blast",
    response: "Rice blast is a serious fungal disease. Use disease-resistant varieties and ensure proper water management. Fungicides like Tricyclazole can be effective.",
  },
  {
    query: "paddy",
    response: "For paddy, water management is key. Maintain 2-5 cm of water in the field after transplanting. Use a balanced dose of NPK fertilizers for best results.",
  }
]

// Sample suggested queries in English - EXPANDED
const suggestedQueries = [
  {
    text: "How to control blast in rice?",
    icon: <Leaf className="h-3 w-3" />,
  },
  {
    text: "Best time to sow wheat?",
    icon: <CloudRain className="h-3 w-3" />,
  },
  {
    text: "How to get crop insurance?",
    icon: <Lightbulb className="h-3 w-3" />,
  },
  {
    text: "What is the market price for paddy?",
    icon: <BarChart3 className="h-3 w-3" />,
  },
   {
    text: "Fertilizer dose for wheat?",
    icon: <FlaskConical className="h-3 w-3" />,
  },
    {
    text: "How to improve soil health?",
    icon: <Sprout className="h-3 w-3" />,
  },
   {
    text: "How to store grains safely?",
    icon: <Warehouse className="h-3 w-3" />,
  },
]

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function AgriAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I am your agricultural assistant. You can ask me any question about farming, crops, weather, or market prices.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true); // State for accordion
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial check
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Handle send message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let botResponse = ""
      const lowerCaseInput = inputValue.toLowerCase()

      if (isOnline) {
        // Online mode - simulate AI response with more keyword matching
        if (lowerCaseInput.includes("weather")) {
          botResponse =
            "Today's weather in Hyderabad will be partly cloudy. The temperature is expected to be around 31°C. Light showers are possible in the next 2 days. This is a good time for crop irrigation."
        } else if (
          lowerCaseInput.includes("pest") ||
          lowerCaseInput.includes("disease")
        ) {
          botResponse =
            "Could you please specify the crop and the disease? For example, 'yellow rust in wheat' or 'blast disease in rice'."
        } else if (
            lowerCaseInput.includes("rice") || lowerCaseInput.includes("paddy")
        ) {
             if (lowerCaseInput.includes("blast")) {
                 botResponse = "For Rice Blast disease, ensure the field is not overly fertilized with nitrogen. Maintain shallow water and consider spraying fungicides like Tricyclazole or Azoxystrobin after consulting a local expert."
             } else if (lowerCaseInput.includes("fertilizer")) {
                 botResponse = "For paddy, the general recommendation is 120:60:40 kg/ha of N:P:K. Apply phosphorus and potassium as a basal dose, and nitrogen in 3 split doses for better efficiency."
             } else {
                 botResponse = "Rice is a major crop in this region. Are you asking about disease control, fertilizer management, or market price?"
             }
        } else if (
            lowerCaseInput.includes("wheat")
        ) {
            if (lowerCaseInput.includes("rust")) {
                botResponse = "To control Yellow Rust in wheat, remove infected plants early. Avoid excessive irrigation. You can spray Propiconazole 25% EC at 1 ml/liter of water as a preventive measure."
            } else if (lowerCaseInput.includes("sow") || lowerCaseInput.includes("season")) {
                botResponse = "The ideal time for sowing wheat in the Hyderabad region is from the last week of October to the first week of November, when the temperature has cooled down."
            } else {
                botResponse = "For wheat, what information do you need? Sowing time, disease control, or irrigation schedule?"
            }
        } else if (
            lowerCaseInput.includes("grain") && lowerCaseInput.includes("store")
        ) {
            botResponse = "To store grains safely, ensure they are properly dried to a moisture content below 12%. Use clean, airtight containers or bags (like PICS bags) and store them in a cool, dry place away from pests. Using neem leaves can also help."
        }
        else if (
          lowerCaseInput.includes("market") ||
          lowerCaseInput.includes("price")
        ) {
          botResponse =
            "Market prices fluctuate daily. For which crop are you asking the price? For example, 'market price for paddy'."
        } else if (
            lowerCaseInput.includes("fertilizer") ||
            lowerCaseInput.includes("npk") ||
            lowerCaseInput.includes("urea")
        ) {
            botResponse = "Fertilizer requirements depend heavily on the crop and soil health. For a detailed recommendation, please specify the crop and, if possible, the results of a recent soil test."
        } else if (
            lowerCaseInput.includes("soil") ||
            lowerCaseInput.includes("ph")
        ) {
            botResponse = "Good soil health is vital. It's recommended to get your soil tested once every 2-3 years to check nutrient levels and pH. This helps in applying the right amount of fertilizers."
        } else if (
            lowerCaseInput.includes("sow") ||
            lowerCaseInput.includes("plant") ||
            lowerCaseInput.includes("season")
        ) {
             botResponse = "In Hyderabad, September is a good time to prepare for the Rabi crop season. You can consider crops like Jowar, Maize, Bengal gram, and sunflower. Ensure the field is well-ploughed."
        } else if (
            lowerCaseInput.includes("yield") ||
            lowerCaseInput.includes("increase")
        ) {
            botResponse = "To increase crop yield, focus on using high-quality certified seeds, ensuring balanced nutrition through soil testing, implementing proper irrigation techniques, and managing weeds and pests effectively."
        } else {
          botResponse =
            "I'm sorry, I couldn't find a specific answer for that. You can ask me about crop diseases, market prices, fertilizers, soil health, or what to plant."
        }
      } else {
        // Offline mode - use predefined responses
        const matchedResponse = offlineResponses.find((item) =>
          lowerCaseInput.includes(item.query.toLowerCase()),
        )
        botResponse = matchedResponse
          ? matchedResponse.response
          : "I am currently in offline mode and can provide limited information. For more accurate information, please connect to the internet."
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1500)
  }

  // Handle voice input
  const handleVoiceInput = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true)
      toast({
        title: "Voice recording started",
        description: "Please speak your question...",
        duration: 3000,
      })

      // Simulate voice recognition (in a real app, this would use the Web Speech API)
      setTimeout(() => {
        setIsRecording(false)
        setInputValue("My wheat crop has yellow rust, what should I do?")
        toast({
          title: "Voice recording complete",
          description: "Your question has been transcribed.",
          duration: 3000,
        })
      }, 3000)
    } else {
      // Stop recording
      setIsRecording(false)
      toast({
        title: "Voice recording stopped",
        description: "Recording has been stopped.",
        duration: 3000,
      })
    }
  }

  // Handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    if (isSpeaking) {
      // Stop speaking
      setIsSpeaking(false)
      toast({
        title: "Reading stopped",
        description: "Text-to-speech has been stopped.",
        duration: 3000,
      })
    } else {
      // Start speaking
      setIsSpeaking(true)
      toast({
        title: "Reading started",
        description: "Started reading the text.",
        duration: 3000,
      })

      // Simulate speech (in a real app, this would use the Web Speech API)
      setTimeout(() => {
        setIsSpeaking(false)
      }, 5000)
    }
  }

  // Handle suggested query click
  const handleSuggestedQuery = (query: string) => {
    setInputValue(query)
    // Automatically send the message when a suggestion is clicked
    // This is a UX improvement
    setTimeout(() => {
        // We find the send button and click it programmatically
        // The timeout ensures the state update for inputValue is processed first
        document.getElementById('send-button')?.click();
    }, 100);
  }

  return (
    <>
      {/* Floating button - only show when chat is closed */}
      {!isOpen && (
        <Button
          className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg z-50 bg-green-600 hover:bg-green-700"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat dialog */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[90%] max-w-md h-[70vh] max-h-[500px] shadow-xl z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-white">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AgriBot" />
                <AvatarFallback className="bg-green-100 text-green-800">AB</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Agri Assistant (AgriBot)</h3>
                <div className="flex items-center gap-1 text-xs">
                  {isOnline ? (
                    <Badge className="bg-green-500 text-white px-1 py-0 text-[10px] flex items-center gap-1">
                      <Wifi className="h-2 w-2" /> Online
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white px-1 py-0 text-[10px] flex items-center gap-1">
                      <WifiOff className="h-2 w-2" /> Offline
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8 hover:bg-green-600"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.sender === "user"
                        ? "bg-green-600 text-white rounded-tr-none"
                        : "bg-white border rounded-tl-none",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex justify-end items-center mt-1 gap-1">
                      <p className="text-[10px] opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {message.sender === "bot" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 rounded-full"
                          onClick={() => handleTextToSpeech(message.content)}
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-3 w-3 text-gray-500" />
                          ) : (
                            <VolumeIcon className="h-3 w-3 text-gray-500" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested queries ACCORDION */}
          <div className="p-2 border-t bg-gray-50">
            <button 
                className="w-full flex justify-between items-center text-xs text-gray-600 font-medium"
                onClick={() => setShowSuggestions(!showSuggestions)}
            >
                <span>Suggested Queries</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", showSuggestions && "rotate-180")} />
            </button>
            {showSuggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                    <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => handleSuggestedQuery(query.text)}
                    >
                    {query.icon}
                    <span className="ml-1">{query.text}</span>
                    </Button>
                ))}
                </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Button
                variant={isRecording ? "default" : "outline"}
                size="icon"
                className={cn("flex-shrink-0", isRecording && "bg-red-500 hover:bg-red-600")}
                onClick={handleVoiceInput}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your question here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                id="send-button"
                className="flex-shrink-0 bg-green-600 hover:bg-green-700"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!isOnline && (
              <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Offline mode: Limited responses available.
              </p>
            )}
          </div>
        </Card>
      )}
    </>
  )
}

