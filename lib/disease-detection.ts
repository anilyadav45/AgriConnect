// Simulated disease detection function
// In a real app, this would call an AI model API

// Mock database of crop diseases
const cropDiseases = [
  {
    id: "d1",
    disease: "पत्ती झुलसा रोग (Leaf Blight)",
    scientificName: "Alternaria triticina",
    confidence: 92,
    description:
      "पत्ती झुलसा एक कवक जनित रोग है जो गेहूं और अन्य अनाज फसलों को प्रभावित करता है। यह पत्तियों पर भूरे रंग के धब्बे बनाता है जो बाद में बड़े होकर पत्ती को सुखा देते हैं।",
    symptoms: [
      "पत्तियों पर भूरे रंग के छोटे धब्बे",
      "धब्बों के चारों ओर पीला हेलो (प्रभामंडल)",
      "धब्बों का आकार बढ़कर अनियमित होना",
      "प्रभावित पत्तियों का सूखना और मुरझाना",
    ],
    treatments: [
      "कॉपर ऑक्सीक्लोराइड @ 2.5 ग्राम/लीटर पानी का छिड़काव करें",
      "प्रोपिकोनाजोल 25% EC @ 1 मिली/लीटर पानी का छिड़काव करें",
      "10-12 दिनों के अंतराल पर छिड़काव दोहराएं",
      "प्रभावित पत्तियों को हटाकर नष्ट करें",
    ],
    preventions: [
      "रोग प्रतिरोधी किस्मों का उपयोग करें",
      "फसल चक्र अपनाएं",
      "संतुलित उर्वरक का प्रयोग करें",
      "खेत की स्वच्छता बनाए रखें",
      "बीज उपचार करें",
    ],
    severity: "medium",
    affectedCrops: ["गेहूं", "जौ", "मक्का"],
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "d2",
    disease: "पीला रतुआ (Yellow Rust)",
    scientificName: "Puccinia striiformis",
    confidence: 88,
    description:
      "पीला रतुआ गेहूं का एक प्रमुख रोग है जो पत्तियों पर पीले रंग की धारियां बनाता है। यह ठंडे और नम मौसम में तेजी से फैलता है और फसल की उपज को 30-40% तक कम कर सकता है।",
    symptoms: [
      "पत्तियों पर पीले रंग की धारीदार उभार",
      "धारियों का पत्ती के समानांतर होना",
      "रोग बढ़ने पर पूरी पत्ती का पीला पड़ना",
      "गंभीर स्थिति में दानों का सिकुड़ना",
    ],
    treatments: [
      "प्रोपिकोनाजोल 25% EC @ 1 मिली/लीटर पानी का छिड़काव करें",
      "ट्राईफ्लोक्सीस्ट्रोबिन 25% + टेबुकोनाजोल 50% @ 0.4 ग्राम/लीटर पानी का छिड़काव करें",
      "15 दिनों के अंतराल पर छिड़काव दोहराएं",
    ],
    preventions: [
      "रोग प्रतिरोधी किस्मों जैसे HD-2967, HD-3086 का उपयोग करें",
      "समय पर बुवाई करें (अक्टूबर के अंतिम सप्ताह से नवंबर के मध्य तक)",
      "संतुलित उर्वरक का प्रयोग करें",
      "खेत की नियमित निगरानी करें",
    ],
    severity: "high",
    affectedCrops: ["गेहूं"],
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "d3",
    disease: "झुलसा रोग (Blast)",
    scientificName: "Magnaporthe oryzae",
    confidence: 95,
    description:
      "झुलसा रोग चावल का एक प्रमुख रोग है जो पत्तियों, तनों और बालियों को प्रभावित करता है। यह कवक जनित रोग है जो अधिक आर्द्रता और तापमान में तेजी से फैलता है।",
    symptoms: [
      "पत्तियों पर हीरे के आकार के भूरे धब्बे",
      "धब्बों का बाद में बड़ा होकर अनियमित आकार लेना",
      "प्रभावित हिस्से का सूखना",
      "बालियों का काला पड़ना और टूटना",
    ],
    treatments: [
      "ट्राईसाइक्लाजोल 75% WP @ 0.6 ग्राम/लीटर पानी का छिड़काव करें",
      "आइसोप्रोथिओलेन 40% EC @ 1.5 मिली/लीटर पानी का छिड़काव करें",
      "10-15 दिनों के अंतराल पर छिड़काव दोहराएं",
    ],
    preventions: [
      "रोग प्रतिरोधी किस्मों का उपयोग करें",
      "नाइट्रोजन उर्वरक का संतुलित प्रयोग करें",
      "खेत में पानी का उचित प्रबंधन करें",
      "बीज उपचार करें",
    ],
    severity: "high",
    affectedCrops: ["चावल"],
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
]

// Function to simulate disease detection
export const detectDisease = async (imageUrl: string): Promise<any> => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // For demo purposes, randomly select a disease from the database
  // In a real app, this would use computer vision to analyze the image
  const randomIndex = Math.floor(Math.random() * cropDiseases.length)
  return cropDiseases[randomIndex]
}
