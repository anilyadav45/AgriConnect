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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Sample predefined responses for offline mode
const offlineResponses = [
  {
    query: "गेहूं में पीला रोग",
    response:
      "गेहूं में पीला रोग (Yellow Rust) एक कवक जनित रोग है। इसके नियंत्रण के लिए प्रोपिकोनाजोल 25% EC का 0.1% घोल (1 मिली दवा प्रति लीटर पानी) का छिड़काव करें।",
  },
  {
    query: "टमाटर की खेती",
    response:
      "टमाटर की खेती के लिए उपयुक्त मिट्टी दोमट या बलुई दोमट होती है। पौध रोपण 60 x 45 सेमी की दूरी पर करें। नत्रजन, फास्फोरस और पोटाश का संतुलित उपयोग करें।",
  },
  {
    query: "फसल बीमा",
    response:
      "प्रधानमंत्री फसल बीमा योजना के अंतर्गत आप अपनी फसल का बीमा करा सकते हैं। इसके लिए नजदीकी बैंक या कृषि विभाग से संपर्क करें।",
  },
  {
    query: "सिंचाई",
    response:
      "ड्रिप सिंचाई और स्प्रिंकलर सिंचाई जल संरक्षण के प्रभावी तरीके हैं। इनसे 30-50% पानी की बचत होती है और फसल की उपज भी बढ़ती है।",
  },
  {
    query: "जैविक खेती",
    response:
      "जैविक खेती में रासायनिक उर्वरकों और कीटनाशकों के बजाय प्राकृतिक विधियों का उपयोग किया जाता है। जैविक खाद, जीवामृत, और नीम आधारित कीटनाशक प्रभावी विकल्प हैं।",
  },
]

// Sample suggested queries
const suggestedQueries = [
  {
    text: "गेहूं में पीला रोग कैसे रोकें?",
    icon: <Leaf className="h-3 w-3" />,
  },
  {
    text: "इस मौसम में क्या बोना चाहिए?",
    icon: <CloudRain className="h-3 w-3" />,
  },
  {
    text: "फसल बीमा कैसे करवाएं?",
    icon: <Lightbulb className="h-3 w-3" />,
  },
  {
    text: "आलू का अच्छा बाज़ार भाव कब मिलेगा?",
    icon: <BarChart3 className="h-3 w-3" />,
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
      content: "नमस्ते! मैं आपका कृषि सहायक हूँ। आप मुझसे खेती-बाड़ी, फसलों, मौसम, या बाज़ार भाव के बारे में कोई भी प्रश्न पूछ सकते हैं।",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
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

      if (isOnline) {
        // Online mode - simulate AI response
        // In a real app, this would call an AI API
        if (inputValue.toLowerCase().includes("मौसम") || inputValue.toLowerCase().includes("weather")) {
          botResponse =
            "आज जयपुर में मौसम साफ रहेगा। तापमान 32°C रहने की संभावना है। अगले 2 दिनों में हल्की बारिश हो सकती है। फसल सिंचाई के लिए यह अच्छा समय है।"
        } else if (
          inputValue.toLowerCase().includes("कीट") ||
          inputValue.toLowerCase().includes("रोग") ||
          inputValue.toLowerCase().includes("disease")
        ) {
          botResponse =
            "फसल में कीट या रोग के लक्षण दिखने पर तुरंत उपचार करें। आप हमारे रोग पहचान टूल का उपयोग करके सटीक निदान प्राप्त कर सकते हैं। फोटो अपलोड करें और विशेषज्ञ सलाह पाएं।"
        } else if (
          inputValue.toLowerCase().includes("बाज़ार") ||
          inputValue.toLowerCase().includes("मूल्य") ||
          inputValue.toLowerCase().includes("price")
        ) {
          botResponse =
            "वर्तमान में गेहूं का औसत बाज़ार मूल्य ₹2240 प्रति क्विंटल है। आप अपने नज़दीकी मंडी में बेहतर मूल्य के लिए हमारे मार्केट प्राइस सेक्शन में जाकर तुलना कर सकते हैं।"
        } else {
          botResponse =
            "आपके प्रश्न के लिए धन्यवाद। मैं आपकी सहायता करने के लिए हूँ। क्या आप अपने प्रश्न को और अधिक विस्तार से बता सकते हैं या किसी विशिष्ट फसल के बारे में पूछना चाहते हैं?"
        }
      } else {
        // Offline mode - use predefined responses
        const matchedResponse = offlineResponses.find((item) =>
          inputValue.toLowerCase().includes(item.query.toLowerCase()),
        )
        botResponse = matchedResponse
          ? matchedResponse.response
          : "मैं वर्तमान में ऑफलाइन मोड में हूँ और सीमित जानकारी प्रदान कर सकता हूँ। इंटरनेट कनेक्शन होने पर अधिक सटीक जानकारी मिलेगी।"
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
        title: "आवाज रिकॉर्डिंग शुरू",
        description: "कृपया अपना प्रश्न बोलें...",
        duration: 3000,
      })

      // Simulate voice recognition (in a real app, this would use the Web Speech API)
      setTimeout(() => {
        setIsRecording(false)
        setInputValue("मेरी गेहूं की फसल में पीला रोग लगा है, क्या करूं?")
        toast({
          title: "आवाज रिकॉर्डिंग पूरी हुई",
          description: "आपका प्रश्न दर्ज किया गया है।",
          duration: 3000,
        })
      }, 3000)
    } else {
      // Stop recording
      setIsRecording(false)
      toast({
        title: "आवाज रिकॉर्डिंग रुकी",
        description: "रिकॉर्डिंग रोक दी गई है।",
        duration: 3000,
      })
    }
  }

  // Handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    if (isSpeaking) {
      // Stop speaking
      setIsSpeaking(false)
      // In a real app, this would use the Web Speech API to stop speaking
      toast({
        title: "पठन रुका",
        description: "पाठ का पठन रोक दिया गया है।",
        duration: 3000,
      })
    } else {
      // Start speaking
      setIsSpeaking(true)
      toast({
        title: "पठन शुरू",
        description: "पाठ का पठन शुरू किया गया है।",
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
                <h3 className="font-medium">कृषि सहायक (AgriBot)</h3>
                <div className="flex items-center gap-1 text-xs">
                  {isOnline ? (
                    <Badge className="bg-green-500 text-white px-1 py-0 text-[10px] flex items-center gap-1">
                      <Wifi className="h-2 w-2" /> ऑनलाइन
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white px-1 py-0 text-[10px] flex items-center gap-1">
                      <WifiOff className="h-2 w-2" /> ऑफलाइन
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

          {/* Suggested queries */}
          <div className="p-2 border-t bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">सुझाए गए प्रश्न:</p>
            <div className="flex flex-wrap gap-2">
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
                placeholder="अपना प्रश्न यहां लिखें..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
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
                ऑफलाइन मोड: सीमित प्रतिक्रियाएँ उपलब्ध हैं
              </p>
            )}
          </div>
        </Card>
      )}
    </>
  )
}
